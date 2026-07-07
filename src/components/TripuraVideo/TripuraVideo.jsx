import "./TripuraVideo.css";

const TripuraVideo = () => {
  return (
    <section className="tripura-video-section">
      {/* Top Curves (mirrored hero curves, blending from #080808) */}
      <div className="video-curve-top">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path fill="rgba(255, 255, 255, 0.08)" d="M0,120 C320,70 640,170 960,120 C1280,70 1360,100 1440,110 L1440,0 L0,0 Z"></path>
          <path fill="rgba(255, 255, 255, 0.18)" d="M0,80 C360,30 720,130 1080,80 C1260,60 1380,80 1440,90 L1440,0 L0,0 Z"></path>
          <path fill="#080808" d="M0,50 C400,-10 800,100 1200,40 C1320,20 1380,30 1440,40 L1440,0 L0,0 Z"></path>
        </svg>
      </div>

      {/* Video Container */}
      <div className="video-container">
        <video
          src="/Earth_zooming_to_Tripura_map_202607071130.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="tripura-video"
        />
        <div className="video-overlay" />
      </div>

      {/* Bottom Curves (exact hero curves, blending to #0d0d0d) */}
      <div className="video-curve-bottom">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path fill="rgba(255, 255, 255, 0.08)" d="M0,80 C320,130 640,30 960,80 C1280,130 1360,100 1440,90 L1440,200 L0,200 Z"></path>
          <path fill="rgba(255, 255, 255, 0.18)" d="M0,120 C360,170 720,70 1080,120 C1260,140 1380,120 1440,110 L1440,200 L0,200 Z"></path>
          <path fill="#0d0d0d" d="M0,150 C400,210 800,100 1200,160 C1320,180 1380,170 1440,160 L1440,200 L0,200 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default TripuraVideo;
