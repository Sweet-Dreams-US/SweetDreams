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

interface SiteLiveProps {
  contactName: string;
  businessName: string;
  liveUrl: string;
  /** e.g. "September 15, 2026" */
  billingStartDisplay: string;
  /** e.g. "$95" */
  monthlyDisplay: string;
  /** "the 1st" or "the 15th" */
  anchorDayDisplay: string;
  portalUrl: string;
}

export const SiteLive = ({
  contactName,
  businessName,
  liveUrl,
  billingStartDisplay,
  monthlyDisplay,
  anchorDayDisplay,
  portalUrl,
}: SiteLiveProps) => (
  <Html>
    <Head />
    <Preview>Your website is live!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your website is live</Heading>

        <Text style={text}>Hi {contactName},</Text>

        <Text style={text}>
          The new website for <strong>{businessName}</strong> is officially
          live. Go take a look and share it everywhere.
        </Text>

        <Section style={buttonWrap}>
          <Button style={button} href={liveUrl}>
            Visit Your Website
          </Button>
        </Section>

        <Section style={billingBox}>
          <Text style={billingTitle}>Your hosting billing</Text>
          <Text style={billingText}>
            Your first hosting payment of {monthlyDisplay} runs on{' '}
            {billingStartDisplay}, then monthly on {anchorDayDisplay} from
            then on, using the payment method you saved. Nothing else to do.
          </Text>
        </Section>

        <Text style={text}>
          Your client portal always has your live link, your agreement, and
          your website status.
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

export default SiteLive;

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
  fontSize: '30px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  lineHeight: '1.3',
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const buttonWrap = {
  textAlign: 'center' as const,
  margin: '20px 0',
};

const button = {
  backgroundColor: '#28c840',
  borderRadius: '8px',
  color: '#0e0e0e',
  fontSize: '17px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '15px 30px',
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

const billingBox = {
  backgroundColor: '#f0fdf2',
  border: '1px solid #bbe7c4',
  padding: '16px 20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const billingTitle = {
  color: '#0e0e0e',
  fontSize: '15px',
  fontWeight: 'bold',
  margin: '0 0 6px',
};

const billingText = {
  color: '#333333',
  fontSize: '14px',
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
