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

interface AgreementTerminatedProps {
  contactName: string;
  businessName: string;
  /** true = ended immediately (pre live); false = 60 day notice period */
  instant: boolean;
  /** e.g. "October 11, 2026" */
  effectiveDisplay: string;
  portalUrl: string;
}

export const AgreementTerminated = ({
  contactName,
  businessName,
  instant,
  effectiveDisplay,
  portalUrl,
}: AgreementTerminatedProps) => (
  <Html>
    <Head />
    <Preview>Your Sweet Dreams agreement has ended</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your agreement has ended</Heading>

        <Text style={text}>Hi {contactName},</Text>

        <Text style={text}>
          This confirms that the Website Services and Hosting Agreement for{' '}
          <strong>{businessName}</strong> has been terminated.
        </Text>

        <Section style={box}>
          {instant ? (
            <Text style={boxText}>
              Your website was not yet live, so per the agreement the
              termination takes effect immediately. You owe nothing.
            </Text>
          ) : (
            <Text style={boxText}>
              Per the agreement, a 60 day notice period applies. Your hosting
              and website stay active through{' '}
              <strong>{effectiveDisplay}</strong>, and hosting fees continue
              through that date. If you would like to keep the website through
              a buyout, reply to this email and we will walk you through it.
            </Text>
          )}
        </Section>

        <Text style={text}>
          Your brand materials and any content you provided are returned on
          request. Your portal stays available in the meantime.
        </Text>

        <Section style={buttonWrap}>
          <Button style={button} href={portalUrl}>
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

export default AgreementTerminated;

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
  backgroundColor: '#fafafa',
  border: '1px solid #e6ebf1',
  padding: '16px 20px',
  borderRadius: '8px',
  margin: '0 0 16px',
};
const boxText = {
  color: '#333333',
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
