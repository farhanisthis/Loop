import { useEffect, useState } from "react";
import { getImage } from "../../utils/imageStorage";

const StoredImage = ({ imageId, fallbackSrc, alt = "", ...props }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let objectUrl;

    const loadImage = async () => {
      if (!imageId) return;

      try {
        const imageBlob = await getImage(imageId);

        if (imageBlob) {
          objectUrl = URL.createObjectURL(imageBlob);
          setImageUrl(objectUrl);
        } else {
          console.warn("No image found in IndexedDB for:", imageId);
        }
      } catch (error) {
        console.error("Failed to load image:", error);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageId]);

  const src = imageUrl || fallbackSrc;

  if (!src) {
    return (
      <div className="flex aspect-square items-center justify-center bg-gray-100 text-sm text-gray-500">
        Image unavailable
      </div>
    );
  }

  return <img src={src} alt={alt} {...props} />;
};

export default StoredImage;
