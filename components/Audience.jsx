import Image from "next/image";
import enmaKatana from "../public/enma-katana.webp";
import useAudienceEdge from "./useAudienceEdge";
import "./Audience.css";

const audienceTitle = "Audience";

export default function Audience({ children }) {
  const screenRef = useAudienceEdge();

  return (
    <section
      id="audience"
      className="audience-section"
      aria-labelledby="audience-title"
    >
      <header className="audience-stage">
        <div className="audience-title-card">
          <h2
            id="audience-title"
            className="audience-title font-serif-editorial"
          >
            <span className="audience-title-intact">{audienceTitle}</span>
            <span
              className="audience-title-cut"
              data-title={audienceTitle}
              aria-hidden="true"
            />
            <span className="audience-katana" aria-hidden="true">
              <Image src={enmaKatana} alt="" draggable={false} sizes="260px" />
            </span>
          </h2>
          <p className="audience-description font-serif-editorial">
            A curiosity for the stories within
          </p>
        </div>
      </header>
      <div ref={screenRef} className="audience-screen">
        {children}
      </div>
    </section>
  );
}
