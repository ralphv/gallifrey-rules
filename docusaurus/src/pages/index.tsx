import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
            <img src="img/gallifrey-rules-20.png" alt="Logo" style={{  marginTop: '-3rem' }} />
            <Heading as="h1" className="hero__title" style={{ marginTop: '-2rem' }}>
                {siteConfig.title}
            </Heading>
            <p className="hero__subtitle" style={{ marginBottom: '-2rem' }}>{siteConfig.tagline}</p>
        </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello Doctor`}
      description="A modern robust framework for handling real-time events">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
