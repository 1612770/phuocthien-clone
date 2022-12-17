import styles from './PrimaryLayout.module.css';

export interface IPrimaryLayout {
  children: React.ReactNode;
}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({ children }) => {
  return <main className={styles.main}>{children}</main>;
};

export default PrimaryLayout;
