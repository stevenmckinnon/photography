import { DATA } from "@/data/resume";
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  name: string;
  email: string;
  shootType: string;
  preferredDate?: string;
  message: string;
  instagram?: string;
}

const baseUrl = DATA.url;

export const ContactEmail = ({
  name,
  email,
  shootType,
  preferredDate,
  message,
  instagram,
}: EmailTemplateProps) => {
  const previewText = `${shootType} enquiry from ${name}`;

  return (
    <Html>
      <Head />

      <Body style={main}>
        <Preview>{previewText}</Preview>
        <Container style={container}>
          <Section>
            <Img
              src={`${baseUrl}/me.jpg`}
              width="96"
              height="96"
              alt={DATA.name}
              style={userImage}
            />
          </Section>
          <Section>
            <Text style={h1}>Photography Enquiry</Text>
          </Section>
          <Section style={{ paddingBottom: "20px" }}>
            <Row>
              <Text style={heading}>Here&apos;s what {name} wrote</Text>
              <Text style={paragraph}>Contact email: {email}</Text>
              <Text style={paragraph}>Shoot type: {shootType}</Text>
              {preferredDate && (
                <Text style={paragraph}>Preferred date: {preferredDate}</Text>
              )}
              {instagram && (
                <Text style={paragraph}>Instagram: {instagram}</Text>
              )}
              <Text style={review}>{message}</Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const userImage = {
  margin: "0 auto",
  marginBottom: "16px",
  borderRadius: "50%",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const h1 = {
  ...heading,
  margin: "0 auto",
  fontSize: "24px",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const review = {
  ...paragraph,
  padding: "24px",
  backgroundColor: "#f2f3f3",
  borderRadius: "4px",
};
