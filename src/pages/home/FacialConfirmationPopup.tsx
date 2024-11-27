type FacialConfirmationPopupProps = {
  showConfirmationPopup: boolean;
  setShowConfirmationPopup: (value: boolean) => void;
  setShowPopup: (value: boolean) => void;
};
const FacialConfirmationPopup = ({
  setShowConfirmationPopup,
  setShowPopup,
}: FacialConfirmationPopupProps) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="relative w-[500px] bg-[#2C2C2E] rounded-3xl p-4">
        <button
          onClick={() => setShowConfirmationPopup(false)}
          className="absolute top-1 right-4 text-xl text-white hover:text-gray-400"
          aria-label="Close modal"
        >
          x
        </button>
        <div className="bg-[#2C2C2E] rounded-lg p-6">
          <div className="flex flex-col items-center">
            <h2 className="text-white/90 text-2xl font-normal mb-3">
              Face Description Not Found
            </h2>
            <p className="text-white/70 text-base mb-6">
              Your face description is not in our database. Would you like to
              add it now?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowConfirmationPopup(false);
                  setShowPopup(true);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Yes, Add Now
              </button>
              <button
                onClick={() => setShowConfirmationPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                No, Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacialConfirmationPopup;
