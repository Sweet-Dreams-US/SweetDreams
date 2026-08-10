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

interface DemoInviteProps {
  contactName: string;
  businessName: string;
  demoUrl: string;
  driveUrl?: string | null;
  welcomeUrl: string;
  /** e.g. "September 9, 2026" */
  expiresDisplay: string;
}

export const DemoInvite = ({
  contactName,
  businessName,
  demoUrl,
  driveUrl,
  welcomeUrl,
  expiresDisplay,
}: DemoInviteProps) => (
  <Html>
    <Head />
    <Preview>Your demo website is ready to view</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your demo website is ready</Heading>

        <Text style={text}>Hi {contactName},</Text>

        <Text style={text}>
          We built a demo website for <strong>{businessName}</strong> so you
          can see exactly what we would create for you. Take a look, then open
          your private page to compare hosting plans and start your agreement
          whenever you are ready.
        </Text>

        <Section style={buttonWrap}>
          <Button style={button} href={demoUrl}>
            View My Demo Website
          </Button>
        </Section>

        <Section style={buttonWrap}>
          <Button style={buttonDark} href={welcomeUrl}>
            See My Plans and Agreement
          </Button>
        </Section>

        {driveUrl && (
          <Text style={text}>
            We also put together a folder with your brand files. You will find
            the link on your private page.
          </Text>
        )}

        <Text style={smallText}>
          Your private page link is unique to you. Please do not forward it.
          It stays active until {expiresDisplay}. Questions? Just reply to
          this email.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          Sweet Dreams · Fort Wayne, Indiana · sweetdreams.us
        </Text>
      </Container>
    </Body>
  </Html>
);

export default DemoInvite;

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
  margin: '14px 0',
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

const hr = {
  borderColor: '#e6ebf1',
  margin: '24px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '13px',
  lineHeight: '1.5',
};
