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

interface AgreementSignedClientProps {
  contactName: string;
  businessName: string;
  /** Full stored rendered_text snapshot */
  agreementText: string;
  signerName: string;
  /** e.g. "August 9, 2026 at 3:12 PM ET" */
  signedAtDisplay: string;
  sha256: string;
  portalUrl: string;
}

export const AgreementSignedClient = ({
  contactName,
  businessName,
  agreementText,
  signerName,
  signedAtDisplay,
  sha256,
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
          <strong>{businessName}</strong> is signed. A full copy is below for
          your records, and it stays available anytime in your client portal.
        </Text>

        <Section style={buttonWrap}>
          <Button style={button} href={portalUrl}>
            Open Your Client Portal
          </Button>
        </Section>

        <Section style={recordBox}>
          <Text style={recordTitle}>Signature record</Text>
          <Text style={recordText}>Signed by: {signerName}</Text>
          <Text style={recordText}>Signed on: {signedAtDisplay}</Text>
          <Text style={recordText}>Document fingerprint (SHA 256): {sha256}</Text>
        </Section>

        <Hr style={hr} />

        <Text style={agreementHeading}>Your agreement</Text>
        <Section style={agreementBox}>
          <Text style={agreementBody}>{agreementText}</Text>
        </Section>

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
  maxWidth: '640px',
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
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 4px',
  wordBreak: 'break-all' as const,
};

const agreementHeading = {
  color: '#0e0e0e',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const agreementBox = {
  backgroundColor: '#fafafa',
  border: '1px solid #e6ebf1',
  padding: '20px',
  borderRadius: '8px',
};

const agreementBody = {
  color: '#333333',
  fontSize: '13px',
  lineHeight: '1.7',
  whiteSpace: 'pre-wrap' as const,
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
