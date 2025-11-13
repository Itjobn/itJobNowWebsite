import Link from "next/link";
import {
  FaGlobe,
  FaDollarSign,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { defaultContent } from "@/lib/constants";

export default function Footer({ content }) {
  const finalContent = content || defaultContent;
  const header = finalContent.header || defaultContent.header;
  const { logo } = header;
  const footer = finalContent.footer || defaultContent.footer;

  const legalLinks = Array.isArray(footer?.legalLinks) && footer.legalLinks.length > 0
    ? footer.legalLinks
    : defaultContent.footer.legalLinks;

  const contact = {
    ...(defaultContent.footer.contact || {}),
    ...(footer?.contact || {}),
  };

  const bottomBar = {
    ...(defaultContent.footer.bottomBar || {}),
    ...(footer?.bottomBar || {}),
  };

  const socialLinks = Array.isArray(footer?.socialLinks) && footer.socialLinks.length > 0
    ? footer.socialLinks
    : defaultContent.footer.socialLinks;

  const SOCIAL_ICON_MAP = {
    facebook: FaFacebook,
    twitter: FaTwitter,
    instagram: FaInstagram,
  };

  const resolveSocialIcon = (platform) => {
    const Icon =
      SOCIAL_ICON_MAP[platform?.toLowerCase?.()] || FaGlobe;
    return <Icon className="text-lg" />;
  };

  return (
    <footer className="bg-[#FBFBFB] ">
      {/* Upper Section - Three Columns */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            {/* Logo/Logo Graphic */}
            <div className="mb-4 ">
              {logo?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.image}
                  alt={logo?.text || "Logo"}
                  className="w-60 h-full"
                />
              ) : (
                <div className="font-bold text-primary text-xl">
                  {logo?.text || "ITJobNow"}
                </div>
              )}
            </div>
            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed">
              {footer?.description ||
                defaultContent.footer.description}
            </p>
          </div>

          {/* Middle Column - Legal Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={`${link?.href || index}-${index}`}>
                  <Link
                    href={link?.href || "#"}
                    className="text-gray-700 hover:text-primary transition-colors text-sm"
                  >
                    {link?.label || "Link"}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Contact Us */}
          <div>
            <Link
              href={contact?.href || "/contact"}
              className="text-lg font-bold text-gray-900 mb-4 hover:text-primary transition-colors block"
            >
              {contact?.heading || "Contact Us"}
            </Link>
            <div className="space-y-3 text-sm text-gray-700">
              {contact?.description ? <p>{contact.description}</p> : null}
              {contact?.email ? <p>Email: {contact.email}</p> : null}
              {contact?.location ? <p>Location: {contact.location}</p> : null}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left Side - Copyright and Design Credit */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-700">
              {bottomBar?.copyright ? <p>{bottomBar.copyright}</p> : null}
              {bottomBar?.designCredit ? <p>{bottomBar.designCredit}</p> : null}
            </div>

            {/* Right Side - Language, Currency, Social Media */}
            <div className="flex items-center gap-6">
              {/* Language Selector */}
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaGlobe className="text-gray-600" />
                <span>{bottomBar?.language || "English"}</span>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaDollarSign className="text-gray-600" />
                <span>{bottomBar?.currency || "USD"}</span>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <Link
                    key={`${social?.platform || "social"}-${index}`}
                    href={social?.url || "#"}
                    className="text-gray-700 hover:text-primary transition-colors"
                    aria-label={social?.platform || "Social link"}
                  >
                    {resolveSocialIcon(social?.platform)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
