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

interface AgreementSignedAdminProps {
  businessName: string;
  contactName: string;
  email: string;
  hostingPrice: string;
  updateHours: string;
  buildPrice: string;
  anchorDay: string;
  signerName: string;
  signedAtDisplay: string;
  signerIp: string;
  adminUrl: string;
  accountNote: string;
}

export const AgreementSignedAdmin = ({
  businessName,
  contactName,
  email,
  hostingPrice,
  updateHours,
  buildPrice,
  anchorDay,
  signerName,
  signedAtDisplay,
  signerIp,
  adminUrl,
  accountNote,
}: AgreementSignedAdminProps) => (
  <Html>
    <Head />
    <Preview>{businessName} signed their hosting agreement</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Signed: {businessName}</Heading>

        <Section style={box}>
          <Text style={row}>Contact: {contactName} ({email})</Text>
          <Text style={row}>Hosting: {hostingPrice}/mo · {updateHours} update hours per quarter</Text>
          <Text style={row}>Build value: {buildPrice} · Billing day: the {anchorDay}</Text>
          <Text style={row}>Portal account: {accountNote}</Text>
        </Section>

        <Section style={box}>
          <Text style={rowTitle}>Signature record</Text>
          <Text style={row}>Signed by: {signerName}</Text>
          <Text style={row}>Signed on: {signedAtDisplay}</Text>
          <Text style={row}>IP: {signerIp}</Text>
        </Section>

        <Section style={buttonWrap}>
          <Button style={button} href={adminUrl}>
            Open in Admin
          </Button>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>sweetdreams.us client pipeline</Text>
      </Container>
    </Body>
  </Html>
);

export default AgreementSignedAdmin;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '32px 24px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#0e0e0e',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  lineHeight: '1.4',
};

const box = {
  backgroundColor: '#fafafa',
  border: '1px solid #e6ebf1',
  padding: '14px 18px',
  borderRadius: '8px',
  margin: '0 0 14px',
};

const rowTitle = {
  color: '#0e0e0e',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 6px',
};

const row = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 4px',
};

const buttonWrap = {
  textAlign: 'center' as const,
  margin: '20px 0 0',
};

const button = {
  backgroundColor: '#28c840',
  borderRadius: '8px',
  color: '#0e0e0e',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'inline-block',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '24px 0 12px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
