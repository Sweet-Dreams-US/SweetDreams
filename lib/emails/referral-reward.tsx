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

interface ReferralRewardProps {
  contactName: string;
  /** The business the referrer sent our way. */
  referredBusinessName: string;
  monthsFree: number;
  portalUrl: string;
}

export const ReferralReward = ({
  contactName,
  referredBusinessName,
  monthsFree,
  portalUrl,
}: ReferralRewardProps) => (
  <Html>
    <Head />
    <Preview>Your referral is live. Free hosting is on the way.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your referral just went live</Heading>

        <Text style={text}>Hi {contactName},</Text>

        <Text style={text}>
          <strong>{referredBusinessName}</strong> came to Sweet Dreams through
          your link, and their website is now officially live. Thank you for
          sending them our way.
        </Text>

        <Section style={box}>
          <Text style={boxText}>
            You earned <strong>{monthsFree} months of hosting free</strong>.
            We apply them to your upcoming bills, so those months simply will
            not be charged. You can see all your referrals and rewards in your
            portal.
          </Text>
        </Section>

        <Section style={buttonWrap}>
          <Button style={button} href={`${portalUrl}/referrals`}>
            View Your Referrals
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

export default ReferralReward;

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
  backgroundColor: '#f2faf4',
  border: '1px solid #bfe6c8',
  padding: '16px 20px',
  borderRadius: '8px',
  margin: '0 0 16px',
};
const boxText = {
  color: '#1d3b24',
  fontSize: '15px',
  lineHeight: '1.65',
  margin: '0',
};
const buttonWrap = { textAlign: 'center' as const, margin: '16px 0' };
const button = {
  backgroundColor: '#0e0e0e',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '13px 26px',
  display: 'inline-block',
};
const hr = { borderColor: '#e6ebf1', margin: '24px 0' };
const footer = { color: '#8898aa', fontSize: '13px', lineHeight: '1.5' };
