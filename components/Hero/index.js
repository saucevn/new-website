import Wrapper from 'components/Wrapper';
import { Textfit } from 'react-textfit';
import styles from "./style.css";

export default function Hero({ over, title, subtitle, children }) {
  return (
    <Wrapper>
      <div className={styles.root}>
        {over && <div className={styles.over}>{over}</div>}
        <Textfit className={styles.title} mode="multi" max={100}>
          {title}
        </Textfit>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        {children && <div className={styles.children}>{children}</div>}
      </div>
    </Wrapper>
  );
}