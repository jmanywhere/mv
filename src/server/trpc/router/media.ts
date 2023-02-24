import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import B2 from 'backblaze-b2'

const ImageSchema = z.object({
  image: z.string().transform((val) => Buffer.from(val.replace(/^data:image\/\w+;base64,/, ""), 'base64')),
  fileType: z.string().regex(/^image\/(jpeg|png|gif|bmp|svg\+xml)$/),
  fileName: z.string().regex(/^[^\\/:\*\?"<>\|]+(\.[^\\/:\*\?"<>\|]+)*$/),
});

export const mediaRouter = router({
  uploadImages: publicProcedure
    .input(z.object({ 
      projectName: z.string().min(8),
      banner: ImageSchema,
      logo: ImageSchema,
    })
    .partial({
      banner: true,
      logo: true,
    }))
    .mutation(async ({ input }) => {

      if(!process.env.BACKBLAZE_KEY_ID || !process.env.BACKBLAZE_APP_KEY || !process.env.BACKBLAZE_BUCKET_ID)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing credentials",
        })
      
      const b2 = new B2({
        applicationKeyId: process.env.BACKBLAZE_KEY_ID,
        applicationKey: process.env.BACKBLAZE_APP_KEY,
      });

      let bannerUrl: string | undefined;
      let logoUrl: string | undefined;

      const { data: authData } = await b2.authorize();
      const downloadURL = authData.downloadUrl;
      const bucketName = authData.allowed.bucketName;

      if(input.banner){
        const { data: uploadData } = await b2.getUploadUrl({
          bucketId: process.env.BACKBLAZE_BUCKET_ID,
        });
        const fileExtension = input.banner.fileName.match(/\.[^/.]+$/)?.[0];
        const reqFileName = `mv/${input.projectName}/banner${fileExtension}` as string;

        const { data: bannerFile } = await b2.uploadFile({
          uploadUrl: uploadData.uploadUrl,
          uploadAuthToken: uploadData.authorizationToken,
          data: input.banner.image,
          fileName: reqFileName,
        });
        bannerUrl = `${downloadURL}/file/${bucketName}/${bannerFile.fileName}?timestapm=${bannerFile.uploadTimestamp}`;
      }
      if(input.logo){
        const { data: uploadData } = await b2.getUploadUrl({
          bucketId: process.env.BACKBLAZE_BUCKET_ID,
        });

        const fileExtension = input.logo.fileName.match(/\.[^/.]+$/)?.[0];

        const reqFileName = `mv/${input.projectName}/logo${fileExtension}` as string;

        const { data: logoFile } = await b2.uploadFile({
          uploadUrl: uploadData.uploadUrl,
          uploadAuthToken: uploadData.authorizationToken,
          data: input.logo.image,
          fileName: reqFileName,
        });
        
        logoUrl = `${downloadURL}/file/${bucketName}/${logoFile.fileName}?timestapm=${logoFile.uploadTimestamp}`;
      }

      return {
        bannerUrl,
        logoUrl,
      };
    }
  ),
});
