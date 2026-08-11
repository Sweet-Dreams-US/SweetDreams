import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface UpdateRequestAdminProps {
  businessName: string;
  siteName: string;
  contactName: string;
  title: string;
  details: string;
  adminUrl: string;
}

export const UpdateRequestAdmin = ({
  businessName,
  siteName,
  contactName,
  title,
  details,
  adminUrl,
}: UpdateRequestAdminProps) => (
  <Html>
    <Head />
    <Preview>{businessName} requested a website update</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Update request: {businessName}</Heading>
        <Text style={row}>
          {contactName} · {siteName}
        </Text>
        <Section style={box}>
          <Text style={titleText}>{title}</Text>
          {details ? <Text style={detailText}>{details}</Text> : null}
        </Section>
        <Section style={buttonWrap}>
          <Button style={button} href={adminUrl}>
            Open in Admin
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default UpdateRequestAdmin;

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
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  lineHeight: '1.4',
};
const row = { color: '#666666', fontSize: '14px', margin: '0 0 16px' };
const box = {
  backgroundColor: '#fafafa',
  border: '1px solid #e6ebf1',
  padding: '16px 20px',
  borderRadius: '8px',
};
const titleText = {
  color: '#0e0e0e',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 6px',
};
const detailText = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};
const buttonWrap = { textAlign: 'center' as const, margin: '20px 0 0' };
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
