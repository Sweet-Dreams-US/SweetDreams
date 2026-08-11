import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface SiteUpdateClientProps {
  contactName: string;
  businessName: string;
  title: string;
  summary: string;
  viewUrl: string | null;
  viewLabel: string;
  portalUrl: string;
}

export const SiteUpdateClient = ({
  contactName,
  businessName,
  title,
  summary,
  viewUrl,
  viewLabel,
  portalUrl,
}: SiteUpdateClientProps) => (
  <Html>
    <Head />
    <Preview>We just updated your website</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>We updated your website</Heading>
        <Text style={text}>Hi {contactName},</Text>
        <Text style={text}>
          Here is what changed on the {businessName} website:
        </Text>
        <Section style={box}>
          <Text style={titleText}>{title}</Text>
          <Text style={summaryText}>{summary}</Text>
        </Section>
        {viewUrl ? (
          <Section style={buttonWrap}>
            <Button style={button} href={viewUrl}>
              {viewLabel}
            </Button>
          </Section>
        ) : null}
        <Text style={smallText}>
          You can see every update and request more changes anytime in your
          client portal.
        </Text>
        <Section style={buttonWrap}>
          <Button style={buttonDark} href={portalUrl}>
            Open Your Portal
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          Sweet Dreams · Fort Wayne, Indiana · sweetdreams.us
        </Text>
      </Container>
    </Body>
  </Html>
);

export default SiteUpdateClient;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};
const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 24px',
  marginBottom: '64px',
  maxWidth: '600px',
};
const h1 = {
  color: '#0e0e0e',
  fontSize: '26px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  lineHeight: '1.4',
};
const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};
const box = {
  backgroundColor: '#f0fdf2',
  border: '1px solid #bbe7c4',
  padding: '16px 20px',
  borderRadius: '8px',
  margin: '0 0 16px',
};
const titleText = {
  color: '#0e0e0e',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 6px',
};
const summaryText = {
  color: '#333333',
  fontSize: '15px',
  lineHeight: '1.65',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};
const buttonWrap = { textAlign: 'center' as const, margin: '16px 0' };
const button = {
  backgroundColor: '#28c840',
  borderRadius: '8px',
  color: '#0e0e0e',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '14px 28px',
  display: 'inline-block',
};
const buttonDark = {
  backgroundColor: '#0e0e0e',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '13px 26px',
  display: 'inline-block',
};
const smallText = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '8px 0',
};
const hr = { borderColor: '#e6ebf1', margin: '24px 0' };
const footer = { color: '#8898aa', fontSize: '13px', lineHeight: '1.5' };
