import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
    title: string
    PngPath: string
    description: ReactNode
}

const FeatureList: FeatureItem[] = [
    {
        title: "DevSecOps",
        PngPath: "img/DevSecOps.png",
        description: (
            <>
                Ops Frontier は、DevSecOps を実践するための ベストプラクティス
                を提供し、組織のセキュリティレベル向上と開発スピード向上に貢献します。
            </>
        ),
    },
    {
        title: "Zero Trust Architecture",
        PngPath: "img/zta.drawio.png",
        description: (
            <>
                従来の境界型セキュリティでは、社内ネットワークに侵入されると、内部のシステムやデータは脅威に晒されていました。
                Ops Frontierは、ゼロトラストアーキテクチャ を採用し、全てのアクセスを検証
                することで、社内外を問わず、あらゆる脅威からシステムを保護 します。
            </>
        ),
    },
    {
        title: "オールインワン",
        PngPath: "img/toolbox.png",
        description: <>Ops Frontierは、DevSecOpsの実践に必要な機能を オールインワン で提供するプラットフォームです。</>,
    },
]

function Feature({title, PngPath, description}: FeatureItem) {
  return (
      <div className={clsx("col col--4")}>
          <div className="text--center">
              <img src={PngPath} class=".featureImg" />
          </div>
          <div className="text--center padding-horiz--md">
              <Heading as="h3">{title}</Heading>
              <p>{description}</p>
          </div>
      </div>
  )
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
