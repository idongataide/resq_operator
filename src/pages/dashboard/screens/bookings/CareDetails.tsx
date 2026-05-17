import { useEffect, useState } from "react";
import {
  FiCamera,
  FiChevronUp,
  FiFileText,
  FiClipboard,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

interface CareDetailsProps {
  booking: any;
}

const CareDetails: React.FC<CareDetailsProps> = ({ booking }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImageSet, setCurrentImageSet] = useState<'pre' | 'post'>('pre');

  console.log("Booking data in CareDetails:", booking);

  // Extract data from booking
  const preCareImages = booking?.pre_care_doc?.images || [];
  const preCareNote = booking?.pre_care_doc?.note || "No note provided";
  const postCareImages = booking?.post_care_doc?.images || [];
  const postCareNote = booking?.post_care_doc?.note || "No note provided";
  const diagnosis = booking?.treatment_doc?.diagnosis || "No diagnosis provided";
  const treatment = booking?.treatment_doc?.treatments || "No treatment provided";
  const medicationGiven = booking?.treatment_doc?.medication_given || "No medication provided";
  const handoffNote = booking?.handover_note || "No handoff note provided";

  const openImageModal = (images: string[], index: number, type: 'pre' | 'post') => {
    setCurrentImageSet(type);
    setCurrentImageIndex(index);
    setSelectedImage(images[index]);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const images = currentImageSet === 'pre' ? preCareImages : postCareImages;
    if (currentImageIndex < images.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  const prevImage = () => {
    const images = currentImageSet === 'pre' ? preCareImages : postCareImages;
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentImageIndex, currentImageSet]);

  const ImageGallery = ({ images, type }: { images: string[], type: 'pre' | 'post' }) => {
    if (images.length === 0) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg mb-4">
          <p className="text-sm text-gray-500">No {type === 'pre' ? 'pre-treatment' : 'post-treatment'} photos available</p>
        </div>
      );
    }

    return (
      <div className="relative mb-4">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex gap-3" style={{ minWidth: 'min-content' }}>
            {images.map((photo: string, index: number) => (
              <div 
                key={index} 
                className="relative group cursor-pointer flex-shrink-0"
                style={{ width: '120px' }}
                onClick={() => openImageModal(images, index, type)}
              >
                <img 
                  src={photo} 
                  alt={`${type === 'pre' ? 'Pre treatment' : 'Post treatment'} ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />               
              </div>
            ))}
          </div>
        </div>
        {images.length > 3 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white to-transparent w-12 h-full pointer-events-none" />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="w-full max-w-5xl rounded-2xl shadow-xs bg-white overflow-hidden mt-3">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#FDF6F6] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100">
              <FiClipboard className="w-4 h-4 text-[#DB4A47]" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide text-[#000A0F] uppercase">
              CARE DETAILS
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <FiChevronUp className="w-4 h-4 text-[#DB4A47]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Pre Treatment Section */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100">
                <FiCamera className="w-4 h-4 text-[#DB4A47]" />
              </div>
              <h3 className="text-base font-semibold text-[#000A0F]">Pre Treatment Documentation</h3>
            </div>
            
            <ImageGallery images={preCareImages} type="pre" />

            {/* Pre Treatment Note */}
            <div className="bg-[#F5F6F7] rounded-xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FiFileText className="w-4 h-4 text-[#354959]" />
                <p className="text-[#354959] font-medium">Note</p>
              </div>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {preCareNote}
              </p>
            </div>
          </div>

          {/* Post Treatment Section */}
          <div className="">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center rounded-md bg-red-100">
                <FiCamera className="w-4 h-4 text-[#DB4A47]" />
              </div>
              <h3 className="text-base font-semibold text-[#000A0F]">Post Treatment Documentation</h3>
            </div>
            
            <ImageGallery images={postCareImages} type="post" />

            {/* Post Treatment Note */}
            <div className="bg-[#F5F6F7] rounded-xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FiFileText className="w-4 h-4 text-[#354959]" />
                <p className="text-[#354959] font-medium">Note</p>
              </div>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {postCareNote}
              </p>
            </div>
          </div>

          {/* Treatment Documentation Section - Full Width */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">           
              <h3 className="text-base font-semibold text-[#000A0F]">Treatment Documentation</h3>
            </div>            
            <div className="bg-[#F5F6F7] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#354959] mb-2">Diagnosis</h3>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {diagnosis}
              </p>
            </div>
            <div className="bg-[#F5F6F7] rounded-xl p-5 mt-3">
              <h3 className="text-sm font-semibold text-[#354959] mb-2">Treatment</h3>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {treatment}
              </p>
            </div>
            <div className="bg-[#F5F6F7] rounded-xl p-5 mt-3">
              <h3 className="text-sm font-semibold text-[#354959] mb-2">Medication Given</h3>
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {medicationGiven}
              </p>
            </div>
          </div>

          {/* Hand off Note Section - Full Width */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">           
              <h3 className="text-base font-semibold text-[#000A0F]">Hand off Note</h3>
            </div>            
            <div className="bg-[#F5F6F7] rounded-xl p-5">
              <p className="text-sm text-[#000A0F] leading-relaxed">
                {handoffNote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <FiX size={32} />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className={`absolute left-4 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2 ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={currentImageIndex === 0}
          >
            <FiChevronLeft size={32} />
          </button>
          
          <img 
            src={selectedImage} 
            alt="Full size"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className={`absolute right-4 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2 ${currentImageIndex === (currentImageSet === 'pre' ? preCareImages.length - 1 : postCareImages.length - 1) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={currentImageIndex === (currentImageSet === 'pre' ? preCareImages.length - 1 : postCareImages.length - 1)}
          >
            <FiChevronRight size={32} />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {(currentImageSet === 'pre' ? preCareImages.length : postCareImages.length)}
          </div>
        </div>
      )}
    </>
  );
};

export default CareDetails;