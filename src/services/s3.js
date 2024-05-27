import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const createPresignedUrlWithClient = ({ region, bucket, key }) => {
  const client = new S3Client({ region });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

const signS3 = async (req, res) => {
  const fileName = req.query['file-name'];
  const s3Params = {
    bucket: process.env.S3_BUCKET_NAME,
    key: fileName,
    acl: 'public-read',
    region: 'us-west-2',
  };
  try {
    const clientURL = await createPresignedUrlWithClient(s3Params);
    const returnData = {
      signedRequest: clientURL,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
    };
    return (res.send(JSON.stringify(returnData)));
  } catch (error) {
    console.log(error);
    return res.status(422).end();
  }
};

export default signS3;
