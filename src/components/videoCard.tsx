const videoCard = () => {
  return (
    <div className="flex flex-col items-start w-[160vh] pl-20 -mr-60">
      <video
        className="w-[80vh] h-[90vh] object-cover rounded-[30px]"
        src="/video.mp4"
        muted={true}
        playsInline={true}
        loop={true}
        autoPlay={true}
        controls={false}
      />
    </div>
  );
};

export default videoCard;
