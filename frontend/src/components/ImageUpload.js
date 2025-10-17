import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ImageUpload = ({ images = [], onChange, maxImages = 5 }) => {
  const [previews, setPreviews] = useState(images);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (previews.length + files.length > maxImages) {
      toast.error(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    const newPreviews = [];
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error('Apenas imagens são permitidas');
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Imagem muito grande! Máximo 5MB');
        continue;
      }

      // Converter para base64
      const base64 = await fileToBase64(file);
      newPreviews.push({
        file,
        preview: base64,
        name: file.name
      });
    }

    const updated = [...previews, ...newPreviews];
    setPreviews(updated);
    onChange(updated.map(p => p.preview));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onChange(updated.map(p => p.preview));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview.preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {previews.length < maxImages && (
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">
              {previews.length === 0 ? 'Adicionar fotos' : 'Mais fotos'}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        )}
      </div>

      <p className="text-xs text-gray-500">
        <ImageIcon className="inline h-3 w-3 mr-1" />
        {previews.length}/{maxImages} imagens • Máximo 5MB cada
      </p>
    </div>
  );
};

export default ImageUpload;

