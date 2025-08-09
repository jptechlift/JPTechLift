import { useState } from "react";
import styles from "../../styles/pages/ProductsPage/ProductProcess.module.scss";

interface Step {
  stepTitle: string;
  stepContent: string;
}

interface Stage {
  stage: string;
  description: string;
  steps: Step[];
}

interface Props {
  steps: Stage[];
  image: string; // thêm prop ảnh minh họa duy nhất
}

export default function InstallationSection({ steps, image }: Props) {
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set());

  const toggleStage = (index: number) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedStages(newExpanded);
  };

  return (
    <section id="installation" className={styles["product-process"]}>
      <h2 className={styles["product-process__title"]}>Quy trình lắp đặt</h2>
      <div className={styles["product-process__container"]}>
        <div className={styles["product-process__content-area"]}>
          <div className={styles["product-process__content-box"]}>
            {steps.map((stage, index) => (
              <div key={index} className={styles["product-process__stage"]}>
                <div 
                  className={styles["product-process__text"]}
                  onClick={() => toggleStage(index)}
                >
                  <h3 className={styles["product-process__stage-title"]}>
                    {stage.stage}
                    <span className={`${styles["product-process__toggle-icon"]} ${
                      expandedStages.has(index) ? styles["product-process__toggle-icon--expanded"] : ''
                    }`}>
                      {expandedStages.has(index) ? '−' : '＋'}
                    </span>
                  </h3>
                  
                  <p className={`${styles["product-process__description"]} ${
                    !expandedStages.has(index) ? styles["product-process__description--blur"] : ''
                  }`}>
                    {stage.description}
                  </p>

                  {expandedStages.has(index) && stage.steps.length > 0 && (
                    <ul className={styles["product-process__step-list"]}>
                      {stage.steps.map((s, i) => (
                        <li key={i}>
                          <strong>{s.stepTitle}</strong>: {s.stepContent}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles["product-process__image-wrapper"]}>
          <div className={styles["product-process__image-container"]}>
            <img 
              src={image} 
              alt="Ảnh minh họa quy trình lắp đặt" 
              className={`${styles["product-process__image"]} ${
                expandedStages.size > 0 ? styles["product-process__image--active"] : ''
              }`} 
            />
            <div className={`${styles["product-process__image-overlay"]} ${
              expandedStages.size > 0 ? styles["product-process__image-overlay--active"] : ''
            }`}></div>
            <div className={`${styles["product-process__image-glow"]} ${
              expandedStages.size > 0 ? styles["product-process__image-glow--active"] : ''
            }`}></div>
          </div>
        </div>
      </div>
    </section>
  );
}