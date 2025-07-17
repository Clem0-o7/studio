  const handleImageUpload = async (section, field, files) => {
  try {
    const inspectionId = inspectionData.inspectionId;
    const fileArray = Array.from(files);

    const processedImages = await Promise.all(
      fileArray.map(async file => {
        const path = `${inspectionId}/${Date.now()}-${file.name}`;
        const url = await uploadImageToSupabase(file, path);
        return {
          name: file.name,
          size: file.size,
          url,
          uploadedAt: new Date().toISOString()
        };
      })
    );
