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

interface AgreementInviteProps {
  contactName: string;
  businessName: string;
  /** Formatted, e.g. "$85" */
  hostingPrice: string;
  signingUrl: string;
  /** e.g. "August 23, 2026" */
  expiresDisplay: string;
}

export const AgreementInvite = ({
  contactName,
  businessName,
  hostingPrice,
  signingUrl,
  expiresDisplay,
}: AgreementInviteProps) => (
  <Html>
    <Head />
    <Preview>Your Sweet Dreams website agreement is ready to sign</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your agreement is ready</Heading>

        <Text style={text}>Hi {contactName},</Text>

        <Text style={text}>
          Here is the Website Services and Hosting Agreement for{' '}
          <strong>{businessName}</strong>. It covers your free custom website
          build, your media session, and your hosting plan of{' '}
          <strong>{hostingPrice} per month</strong>. Please read it and sign
          online. It takes about five minutes.
        </Text>

        <Section style={buttonWrap}>
          <Button style={button} href={signingUrl}>
            Review and Sign
          </Button>
        </Section>

        <Text style={smallText}>
          This link is unique to you. Please do not forward it. It expires on{' '}
          {expiresDisplay}. If it expires, just reply to this email and we will
          send a fresh one.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          Sweet Dreams · Fort Wayne, Indiana · sweetdreams.us
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AgreementInvite;

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
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  padding: '0',
  lineHeight: '1.4',
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const buttonWrap = {
  textAlign: 'center' as const,
  margin: '28px 0',
};

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

const smallText = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 8px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '24px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '13px',
  lineHeight: '1.5',
};
