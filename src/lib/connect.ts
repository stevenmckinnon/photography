import PocketBase from "pocketbase";
// initialise client
export const pbClient = new PocketBase("https://photography-database.fly.dev");

// get all images
export const getImages = async () => {
  const imageRecords = await pbClient.collection("photographs").getFullList();

  const images = imageRecords.map((record) => {
    const url = pbClient.files.getURL(record, record.file);
    return {
      url,
      name: record.file,
    };
  });

  return images;
};
