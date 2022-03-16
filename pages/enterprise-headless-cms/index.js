import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Head from 'components/Head';
import Highlight from 'components/Highlight';
import Quote from 'components/Quote';
import EnterpriseStrip, { Point } from 'components/EnterpriseStrip';
import LogosBar from 'components/LogosBar';
import Wrapper from 'components/Wrapper';
import TalkWithUs from 'components/TalkWithUs';
import {
  gqlStaticProps,
  seoMetaTagsFields,
  reviewFields,
  imageFields,
} from 'lib/datocms';
import { renderMetaTags } from 'react-datocms';
import TitleStripWithContent from 'components/TitleStripWithContent';
import Result from 'components/Result';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import Linkedin from 'public/images/logos/linkedin.svg';
import Oberlo from 'public/images/logos/new/oberlo.svg';
import Nhs from 'public/images/logos/new/nhs.svg';
import LittleCaesars from 'public/images/logos/new/little-caesars.svg';
import Mit from 'public/images/logos/new/mit.svg';
import Afsp from 'public/images/logos/new/afsp.svg';
import Harrys from 'public/images/logos/new/harrys.svg';

import s from './style.module.css';

export const getStaticProps = gqlStaticProps(
  `
    {
      page: teamPage(filter: { slug: { eq: "enterprise-headless-cms" } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoH1
        yoastAnalysis
      }
      review1: review(filter: { name: { eq: "Dan Barak" } }) {
        ...reviewFields
      }
      review2: review(filter: { name: { eq: "Jeff Escalante" } }) {
        ...reviewFields
      }
      review3: review(filter: { name: { eq: "Filippo Conforti" } }) {
        ...reviewFields
      }
    }
    ${seoMetaTagsFields}
    ${imageFields}
    ${reviewFields}
  `,
);

function Enterprise({ page, review1, review2, review3 }) {
  return (
    <Layout>
      <Head seo={page.seo} slug={page.slug} />
      <Hero
        seoAnalysis={page.yoastAnalysis}
        kicker={page.seoH1}
        title={
          <>
            Enterprise&nbsp;grade content infrastructure,{' '}
            <Highlight>security and scalability</Highlight>
          </>
        }
        subtitle={
          <>
            A complete headless CMS with the{' '}
            <strong>
              governance, service and features to ensure you take your content
              machine to scale
            </strong>
            . Dedicated onboarding service, premium technical support, private
            cloud and custom SLAs
          </>
        }
      />

      <div id="main-content">
        <LogosBar
          title={
            <>
              We power experiences for{' '}
              <strong>some of the most renowned brands</strong>
            </>
          }
          clients={[
            DeutscheTelekom,
            Hashicorp,
            Verizon,
            Nike,
            Vercel,
            Linkedin,
            Oberlo,
            Nhs,
            LittleCaesars,
            Mit,
            Afsp,
            Harrys,
          ]}
        />
        <EnterpriseStrip
          kicker="Safest CMS for enterprise"
          title="Robust data security, privacy and compliance"
          description={
            <p>
              <strong>Security</strong> and data integrity informs all our
              decisions. DatoCMS enterprise customers can rely on us to ensure
              their <strong>data is safe and remains secure</strong>
            </p>
          }
        >
          <Point
            title="Single Sign-On"
            description="Manage access to DatoCMS through your preferred identity provider."
          />
          <Point
            title="Decoupled Data Storage"
            description="Data is stored in multiple shards to guarantee performance, integrity and safety."
          />
          <Point
            title="ISO 27001 and GDPR Compliance"
            description="We have a GDPR DPA and our data centers are ISO 27001, SOC 1 and SOC 2 compliant."
          />
        </EnterpriseStrip>

        <Quote review={review2} />

        <EnterpriseStrip
          kicker="PERFOMANCE AND SCABILITY GUARANTEED"
          title="We are here to ensure your content has no limits"
          description={
            <p>
              DatoCMS enterprise customers have performance and service SLAs to
              ensure they can <strong>scale without lag</strong>.
            </p>
          }
        >
          <Point
            title="Performance SLA"
            description="Full support with dedicated priority 24/7 guaranteed."
          />
          <Point
            title="Support SLA"
            description="We tailor solutions to any specific use-case with real-time scaling."
          />
          <Point
            title="Solution Architects"
            description="We assist companies in their journey to scale, from bottom to top."
          />
        </EnterpriseStrip>

        <Quote review={review1} />

        <EnterpriseStrip
          kicker={'SUPPORT WITH A SMILE'}
          title="Extend your team with support that works with you"
          description={
            <p>
              DatoCMS enterprise customers can rely on a{' '}
              <strong>friendly team that helps all the way</strong>.
            </p>
          }
        >
          <Point
            title="Shared Slack channel"
            description="Involve the whole team with a dedicated Slack channel."
          />
          <Point
            title="Dedicated Technical & Editorial Onboarding"
            description="Add a DatoCMS integration expert to your project to help you jumpstart your architecture and get running faster."
          />
          <Point
            title="Multiple sandbox environments for testing and backups"
            description="DatoCMS has the best solution on the market for managing backups and progress."
          />
        </EnterpriseStrip>

        <Quote review={review3} />

        <EnterpriseStrip
          kicker={page.yoastAnalysis.relatedKeywords[0].keyword}
          title="Give your team full accountability and governance control"
          description={
            <p>
              DatoCMS enterprise customers can enjoy features and structures
              that <strong>empower their content business.</strong>
            </p>
          }
        >
          <Point
            title="Bespoke Workflows"
            description="Set up a precise state machine to bring a draft content up to the final publication through a series of intermediate, fully customizable approval steps."
          />
          <Point
            title="Enhanced per locale permissions & Granular roles"
            description="Assign the appropriate roles and permissions, even per locale, to your team members, precisely determining what actions they can perform."
          />
          <Point
            title="Live sync backups"
            description="Store all the data, versioned, in your company Amazon AWS account."
          />
        </EnterpriseStrip>

        <div className={s.talkWithUs}>
          <Wrapper>
            <a id="form" className={s.anchor} />
            <div className={s.talkWithUsInner}>
              <div className={s.talkWithUsIntro}>
                <div className={s.talkWithUsTitle}>Talk with us</div>
                <div className={s.talkWithUsDescription}>
                  <p>
                    <strong>Quick and efficient support</strong> is essential
                    for an enterprise headless CMS. Enterprise accounts are put
                    on a fast-lane when it comes to provide help, feature
                    requests and fixes of any kind.{' '}
                    <strong>
                      Our experts are available in a number of ways
                    </strong>
                    , any time that you need us.
                  </p>
                </div>
              </div>
              <TalkWithUs contactFormType="sales" issueType="enterprise" />
            </div>
          </Wrapper>
        </div>

        <TitleStripWithContent
          seoAnalysis={page.yoastAnalysis}
          kicker="DatoCMS dev experience empowers all team"
          title={
            <>
              A technology investment that doubles performaces and productivity
            </>
          }
        >
          <div className={s.grid}>
            <Result
              number="38k"
              href="/customers/oberlo"
              label={
                <>
                  total <Highlight style="good">migrated assets</Highlight>
                </>
              }
            >
              <strong>Oberlo</strong> was able to switch to DatoCMS painlessly,
              offering blinding speed and an intuitive editing process.
            </Result>
            <Result
              number="2TB"
              href="/customers/hashicorp"
              label={
                <>
                  of <Highlight style="good">traffic per month</Highlight>
                </>
              }
            >
              <strong>HashiCorp</strong> needed a flexible and secure CMS to
              manage its ever-expanding multi-site structure.
            </Result>
            <Result
              number="35k"
              label={
                <>
                  <Highlight style="good">users</Highlight>
                </>
              }
            >
              <strong>Vercel</strong> hosted its{' '}
              <a
                href="https://nextjs.org/conf/jun21"
                target="_blank"
                rel="noreferrer"
              >
                Next.js international conference
              </a>{' '}
              on DatoCMS.
            </Result>
          </div>
        </TitleStripWithContent>
      </div>
    </Layout>
  );
}

export default Enterprise;
