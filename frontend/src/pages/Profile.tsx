import { useParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaLinkedin, FaGithub } from 'react-icons/fa';

const iconMap: Record<string, any> = {
  instagram: FaInstagram,
  twitter: FaTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  linkedin: FaLinkedin,
  github: FaGithub,
};

export function Profile() {
  const { address } = useParams<{ address: string }>();
  const { getProfileByAddress } = useProfile(undefined);
  const profile = address ? getProfileByAddress(address) : null;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">This user hasn't created a Forest profile yet.</p>
        </div>
      </div>
    );
  }

  const activeLinks = profile.links.filter(link => link.isActive);
  const socialLinks = activeLinks.filter(link => link.type === 'social');
  const customLinks = activeLinks.filter(link => link.type === 'custom');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              {profile.displayName[0].toUpperCase()}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile.displayName}
            </h1>
            {profile.bio && (
              <p className="text-gray-600 mb-4">{profile.bio}</p>
            )}

            {/* Social Icons */}
            {socialLinks.length > 0 && (
              <div className="flex justify-center gap-4 mb-6">
                {socialLinks.map((link) => {
                  const Icon = link.platform ? iconMap[link.platform] : null;
                  return Icon ? (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    >
                      <Icon size={24} />
                    </a>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="space-y-3">
            {customLinks.length === 0 && socialLinks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No links to display</p>
              </div>
            ) : (
              <>
                {customLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-primary hover:shadow-md transition-all text-center font-semibold text-gray-900"
                  >
                    {link.title}
                  </a>
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <a
              href="/"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Create your own Forest profile →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}



