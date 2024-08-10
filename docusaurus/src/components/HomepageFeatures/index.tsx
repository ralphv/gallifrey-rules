import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
    title: string;
    Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Structured Event-Driven Architecture',
        Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
        description: (
            <>
                Enforces a disciplined approach to event-driven development, ensuring consistency and best practices across your projects.
            </>
        ),
    },
    {
        title: 'Transform Blackboxed Consumers into Highly Visible Components',
        Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
        description: (
            <>
                Modular design with <code>Filters</code>, <code>Rules</code>, <code>DataObjects</code>,
                and <code>Actions</code> as customizable plugins,
                enabling seamless extension and flexibility.
            </>
        ),
    },
    {
        title: 'Dynamic Plugin Architecture',
        Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
        description: (
            <>
                All modules, including plugins and providers, are dynamically loaded and easily extensible.
            </>
        ),
    },
];

function Feature({ title, Svg, description }: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): JSX.Element {
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
