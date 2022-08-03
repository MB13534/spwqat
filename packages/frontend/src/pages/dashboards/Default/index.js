import React from "react";
import styled from "styled-components/macro";

import { Helmet } from "react-helmet-async";

import {
  Grid as MuiGrid,
  Typography as MuiTypography,
  CardContent,
  Card as MuiCard,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardHeader,
  CardMedia,
  Tooltip,
  Box,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import { useAuth0 } from "@auth0/auth0-react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import WaterQualityStorylineSummary from "../../storyLines/waterQuality/WaterQualityStorylineSummary";
import { NavLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { customSecondary, customHighlight } from "../../../theme/variants";
import { Search } from "@material-ui/icons";

const Typography = styled(MuiTypography)(spacing);

const Grid = styled(MuiGrid)(spacing);

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 378px;
`;

const Hero = styled.div`
  background: url("/static/img/sle-bluff-lake.jpeg") left center / cover
    no-repeat;
  height: 300px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Recap = styled.section`
  border-top: 5px solid ${() => customHighlight[500]};
  margin-bottom: 24px;
  margin-top: 24px;
`;

const About = styled.section`
  border-top: 5px solid #424242;
  margin-top: 12px;
  margin-bottom: 24px;
  background-color: ${() => customHighlight[500]};
`;

const Partners = styled.section`
  border-right: 5px solid ${() => customHighlight[500]};
`;

const Description = styled.div`
  background-color: ${({ color = customHighlight[500] }) => color};
  color: white;
  padding: 20px 40px;
`;

const Welcome = styled.div`
  height: 250px;
  background-color: rgba(249, 246, 241, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 26px;
  border-radius: 50%;
  position: absolute;
`;

const StoryCard = styled(Card)`
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35) !important;

  &:hover {
    outline: 4px solid ${() => customSecondary[500]};
    & .title-highlight {
      color: ${() => customSecondary[500]};
    }
  }
`;

const BrandIcon = styled.img`
  vertical-align: middle;
  margin: 30px;
`;

const AboutLink = styled(Link)`
  color: #424242;
  font-weight: 900;
`;

const PartnerLink = styled(Link)`
  color: ${() => customHighlight[500]};
  font-weight: 900;
`;

function Default() {
  const { user } = useAuth0();

  return (
    <React.Fragment>
      <Helmet title="Water Quality Assessment Tool Dashboard" />
      <Hero>
        <Welcome>
          <Typography variant="h3" gutterBottom style={{ color: "white" }}>
            Welcome to the
          </Typography>
          <Typography variant="h2" gutterBottom style={{ color: "white" }}>
            Water Quality Assessment Tool Dashboard
          </Typography>

          <Typography variant="subtitle1" style={{ color: "white" }}>
            {user?.name}
          </Typography>
        </Welcome>
      </Hero>

      <Recap>
        <Grid container>
          <Grid item xs={12} lg={4}>
            <img
              src={"/static/img/water_banner.png"}
              style={{
                margin: "auto",
                display: "block",
                maxWidth: "100%",
                objectFit: "cover",
                height: "100%",
              }}
              alt="Water Waves"
            />
          </Grid>

          <Grid item xs={12} lg={8}>
            <Description color="#424242">
              <Typography
                variant="h3"
                style={{ fontWeight: "100", fontSize: "30px" }}
              >
                Welcome to the Dashboard!
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{
                  padding: "15px",
                  lineHeight: "1.8",
                  fontSize: ".95rem",
                }}
              >
                The South Platte Urban Waters Partnership is excited to present
                the updated water quality assessment tool for exploring the
                health of rivers and streams in the Denver metro area. This
                online tool combines data from 2009 through 2015 for pollutants
                including <em>E. coli</em>, contaminants of emerging concern,
                total dissolved and suspended solids, and nutrients. Use maps,
                graphs and narratives to explore water quality in the South
                Platte River basin. Take the tool into the field with the new
                mobile application and learn how you can protect water quality!
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{
                  padding: "15px",
                  lineHeight: "1.8",
                  fontSize: ".95rem",
                }}
              >
                Continued population and water use growth in the Denver metro
                area impact water quality in streams and rivers. Water pollution
                from urban areas affects plants, aquatic life, wildlife, and
                people. Decision-makers, researchers and the public can use the
                water quality assessment tool to better understand pollution and
                to devise strategies for improving water quality. There is a
                limited amount of water on the planet for our use; learning
                about and actively protecting it is a responsibility we all
                share.
              </Typography>
            </Description>
          </Grid>
        </Grid>
      </Recap>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <StoryCard mb={3}>
            <Accordion>
              <AccordionSummary
                style={{ paddingLeft: 0 }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <CardHeader
                  titleTypographyProps={{ variant: "h3" }}
                  // style={{ margin }}
                  title={
                    <>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        className="title-highlight"
                      >
                        <Typography
                          variant="h3"
                          style={{ fontSize: "1.75rem" }}
                        >
                          Check Out Our Water Quality Storylines!{" "}
                        </Typography>
                        <Search style={{ height: "60px", width: "60px" }} />
                      </Box>
                      <Typography
                        variant="body2"
                        style={{ fontSize: ".9rem" }}
                        gutterBottom
                      >
                        Water quality is complex. Take a dive into the prepared
                        storylines to emerse yourself in comprehensive
                        introduction. From <em>E. coli</em>, to nutrients, to
                        emerging contaminants, learn not only how these
                        constiuents impact water quality, but additionally how
                        they get into the river and how they are regulated. Then
                        take this knowledge and use it to help keep our rivers
                        and streams healthy!
                      </Typography>
                    </>
                  }
                />
              </AccordionSummary>

              <CardContent>
                <AccordionDetails>
                  <WaterQualityStorylineSummary />
                </AccordionDetails>
              </CardContent>
            </Accordion>
          </StoryCard>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <Link
            component={NavLink}
            to="/data-access/map-explorer"
            underline="none"
          >
            <StoryCard mb={3}>
              <CardHeader
                titleTypographyProps={{ variant: "h3" }}
                className="title-highlight"
                title="Map Explorer"
              />
              <CardContent>
                <ChartWrapper>
                  <CardMedia
                    style={{ height: "100%" }}
                    image="/static/img/map.png"
                    title="Map Explorer"
                  />
                </ChartWrapper>
              </CardContent>
            </StoryCard>
          </Link>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Link
            component={NavLink}
            to="/data-access/graph-explorer"
            underline="none"
          >
            <StoryCard mb={3}>
              <CardHeader
                titleTypographyProps={{ variant: "h3" }}
                className="title-highlight"
                title="Graph Explorer"
              />
              <CardContent>
                <ChartWrapper>
                  <CardMedia
                    style={{ height: "100%" }}
                    image="/static/img/graph.png"
                    title="Graph Explorer"
                  />
                </ChartWrapper>
              </CardContent>
            </StoryCard>
          </Link>
        </Grid>
      </Grid>

      <About>
        <Grid container style={{ alignItems: "center" }}>
          <Grid item xs={12} lg={8}>
            <Description color={customHighlight[500]}>
              <Typography
                variant="h3"
                style={{ fontWeight: "100", fontSize: "30px" }}
              >
                About the Tool
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{
                  padding: "15px",
                  lineHeight: "1.8",
                  fontSize: ".95rem",
                }}
              >
                The Denver Metro Water Quality Assessment Tool (WQAT) represents
                the successful colaboration of federal, state, local
                governments, and non-profits to pool resources to make water
                quality data more accessible to decision-makers and general
                public. This tool seeks to provide both context and direct
                access to publically available water quality data for the metro
                area.
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{
                  padding: "15px",
                  lineHeight: "1.8",
                  fontSize: ".95rem",
                }}
              >
                This tool represents a snapshot of conditions for the metro area
                between 2009 and 2015 for a variety of water quality parameters
                including <em>E. coli</em>. , contaminants of emerging concern,
                total dissolved solids, total suspended solids and nutrients. If
                you are not overly familiar with these pollutants, the{" "}
                <AboutLink component={NavLink} to="/storylines/water-quality">
                  Storylines
                </AboutLink>{" "}
                are the perfect place to start. If you are looking to explore
                spatial trends in water quality data or know a particular stream
                you are interested in, then the{" "}
                <AboutLink component={NavLink} to="/data-access/map-explorer">
                  Map Explorer
                </AboutLink>{" "}
                will give you exactly what you need. Lastly, if you are
                interested in visualizing the data in a variety of ways or
                downloading the data, then take a look at the{" "}
                <AboutLink component={NavLink} to="/data-access/graph-explorer">
                  Graph Explorer
                </AboutLink>{" "}
                page.
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{
                  padding: "15px",
                  lineHeight: "1.8",
                  fontSize: ".95rem",
                }}
              >
                This product is for informational purposes only and may not have
                been prepared for or suitable for legal, engineering, or
                surveying purposes. It does not represent an on-the-ground
                survey and represents only the approximate relative location of
                property boundaries. The South Platte Urban Waters Partnership
                and The Water Quality Assessment Tool Working Group expressly
                disclaim any and all liability in connection herewith.
              </Typography>
            </Description>
          </Grid>
          <Grid item xs={12} lg={4} align="center">
            <img
              src={"/static/img/wqat-logo.png"}
              style={{
                margin: "auto",
                display: "block",
              }}
              alt="Water Drop Logo"
            />
          </Grid>
        </Grid>
      </About>

      <Partners>
        <Grid container>
          <Grid item xs={12}>
            <Description color="#424242">
              <Typography
                variant="h3"
                style={{ fontWeight: "100", fontSize: "30px" }}
              >
                Partners
              </Typography>
            </Description>
          </Grid>
        </Grid>

        <Grid
          container
          justify="center"
          align="center"
          // style={{ backgroundColor: "red" }}
        >
          <Grid item xs={12} sm={10} md={9} lg={8}>
            <Tooltip title="Urban Waters Partnership">
              <BrandIcon
                alt="Urban Waters Partnership"
                src="/static/img/partners/urbanWatersPartnership.png"
                style={{ height: "100px" }}
              />
            </Tooltip>
            <Tooltip title="United States Environmental Protection Agency">
              <BrandIcon
                alt="United States Environmental Protection Agency"
                src="/static/img/partners/unitedStatesEnvironmentalProtectionAgency.png"
                style={{ height: "100px" }}
              />
            </Tooltip>
            <Tooltip title="Groundwork Denver">
              <BrandIcon
                alt="Groundwork Denver"
                src="/static/img/partners/groundworkDenver.jpg"
                style={{ height: "100px" }}
              />
            </Tooltip>
            <Tooltip title="Denver Water">
              <BrandIcon
                alt="Denver Water"
                src="/static/img/partners/denverWater.png"
                style={{ height: "100px" }}
              />
            </Tooltip>
            <Tooltip title="United States Geological Survey">
              <BrandIcon
                alt="United States Geological Survey"
                src="/static/img/partners/usgs.png"
                style={{ height: "100px" }}
              />
            </Tooltip>
            <Tooltip title="Forest Service Department of Agriculture">
              <BrandIcon
                alt="Forest Service Department of Agriculture"
                src="/static/img/partners/forestServiceDepartmentOfAgriculture.png"
                style={{ height: "100px" }}
              />
            </Tooltip>
            <Tooltip title="Colorado Department of Public Health & Environment">
              <BrandIcon
                alt="Colorado Department of Public Health & Environment"
                src="/static/img/partners/coloradoDepartmentOfPublicHealthAndEnvironment.png"
                style={{ height: "100px" }}
              />
            </Tooltip>
            <Tooltip title="The City of Denver">
              <BrandIcon
                alt="The City of Denver"
                src="/static/img/partners/cityOfDenver.gif"
                style={{ height: "100px" }}
              />
            </Tooltip>
            <Tooltip title="Metro Wastewater Reclamation District">
              <BrandIcon
                alt="Metro Wastewater Reclamation District"
                src="/static/img/partners/metroWastewaterReclamationDistrict.png"
                style={{ height: "100px" }}
              />
            </Tooltip>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Description color="#424242">
              <Typography
                variant="h3"
                style={{ color: "white", marginTop: "20px" }}
              >
                About the South Platte Urban Waters Partnership
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{
                  padding: "15px",
                  lineHeight: "1.8",
                  fontSize: ".95rem",
                }}
              >
                The{" "}
                <PartnerLink
                  component={NavLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  to="https://www.epa.gov/urbanwaterspartners/urban-waters-and-south-platte-watershed-headwaters-denver-metropolitan-area"
                >
                  South Platte River Urban Waters Partnership
                </PartnerLink>{" "}
                is a collaborative group working to protect and restore lands
                and waters in the South Platte River basin near Denver,
                Colorado. Partners include non-profit, academic, government and
                business groups. The Partnership provides useful tools to assess
                water quality, education to inspire renewed water protection,
                and community connection that ensures ongoing stewardship of the
                South Platte River.
              </Typography>

              <Typography
                variant="h3"
                style={{ color: "white", marginTop: "40px" }}
              >
                The Water Quality Assessment Tool Working Group
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{
                  padding: "15px",
                  lineHeight: "1.8",
                  fontSize: ".95rem",
                }}
              >
                The Water Quality Assessment Tool is the product of a small
                group of members of the South Platte River Urban Waters
                Partnership. They worked tirelessly over 2 years to bring
                thousands of data sets out of storage and into this
                user-friendly, investigative tool. Thank you to all who
                dedicated their time, expertise, and financial resources to
                bring the Water Quality Assessment Tool to life!
              </Typography>
            </Description>
          </Grid>
        </Grid>
      </Partners>
    </React.Fragment>
  );
}

export default Default;
