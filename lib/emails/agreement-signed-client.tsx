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

/**
 * Signed confirmation.
 *
 * The agreement text is deliberately NOT in this email. Email can be
 * forwarded, sits unencrypted in inboxes, and is easy to grab from a
 * logged-in device. The client reads the full agreement behind their
 * portal login instead; here they only get proof it was signed.
 */
interface AgreementSignedClientProps {
  contactName: string;
  businessName: string;
  signerName: string;
  /** e.g. "August 9, 2026 at 3:12 PM ET" */
  signedAtDisplay: string;
  portalUrl: string;
}

export const AgreementSignedClient = ({
  contactName,
  businessName,
  signerName,
  signedAtDisplay,
  portalUrl,
}: AgreementSignedClientProps) => (
  <Html>
    <Head />
    <Preview>Signed and confirmed. Welcome to Sweet Dreams.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You are all set, {contactName}</Heading>

        <Text style={text}>
          Your Website Services and Hosting Agreement for{' '}
          <strong>{businessName}</strong> is signed. Thank you.
        </Text>

        <Section style={recordBox}>
          <Text style={recordTitle}>Signature confirmation</Text>
          <Text style={recordText}>Signed by: {signerName}</Text>
          <Text style={recordText}>Signed on: {signedAtDisplay}</Text>
        </Section>

        <Text style={text}>
          For your security we do not include the agreement in email. Log in
          to your client portal to read it, download it, follow your website
          build, and request changes anytime.
        </Text>

        <Section style={buttonWrap}>
          <Button style={button} href={portalUrl}>
            Open Your Client Portal
          </Button>
        </Section>

        <Text style={smallText}>
          You log in with this email address. There is no username.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          Sweet Dreams · Fort Wayne, Indiana · sweetdreams.us
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AgreementSignedClient;

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
  margin: '24px 0',
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

const recordBox = {
  backgroundColor: '#f0fdf2',
  border: '1px solid #bbe7c4',
  padding: '16px 20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const recordTitle = {
  color: '#0e0e0e',
  fontSize: '15px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const recordText = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 4px',
};

const smallText = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0',
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
