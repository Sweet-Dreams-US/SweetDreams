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

interface SetPasswordEmailProps {
  contactName: string;
  actionUrl: string;
}

export const SetPasswordEmail = ({
  contactName,
  actionUrl,
}: SetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Set your Sweet Dreams client portal password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Set your portal password</Heading>

        <Text style={text}>Hi {contactName},</Text>

        <Text style={text}>
          Your Sweet Dreams client portal account is ready. Click below to set
          your password. From then on you can log in anytime to see your
          website status, your live links, and your signed agreement.
        </Text>

        <Section style={buttonWrap}>
          <Button style={button} href={actionUrl}>
            Set My Password
          </Button>
        </Section>

        <Text style={smallText}>
          This link expires soon for your security. If it stops working, use
          Forgot Password on the portal login page or reply to this email. If
          you already set a password, you can ignore this message.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          Sweet Dreams · Fort Wayne, Indiana · sweetdreams.us
        </Text>
      </Container>
    </Body>
  </Html>
);

export default SetPasswordEmail;

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
