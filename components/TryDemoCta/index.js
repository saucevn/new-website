import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import UiChrome from 'components/UiChrome';
import { Image as DatoImage } from 'react-datocms';
import s from './style.module.css';
import Link from 'next/link';

export default function TryDemoCta({ title, description, shopifyProduct }) {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.left}>
          <div className={s.chrometop}>
            <img width={300} src={shopifyProduct.imageUrl} />
          </div>
        </div>
        <div className={s.box}>
          <div className={s.kicker}>{shopifyProduct.title}</div>
          <h2 className={s.title}>{title}</h2>
          <div className={s.description}>{description}</div>
          <div className={s.actions}>
            <Button as="a" href="#">
              Buy now (USD {shopifyProduct.variants.edges[0].node.price})
            </Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
