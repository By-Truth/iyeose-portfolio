import { Field, TextArea, ListField, SectionHeader } from '../fields'
import ImageUploadField from '../ImageUploadField'

export default function ProfileSection({ profile, siteConfig, onChangeProfile, onChangeSiteConfig }) {
  const set = (key) => (e) => onChangeProfile({ ...profile, [key]: e.target.value })
  const setSite = (key) => (e) => onChangeSiteConfig({ ...siteConfig, [key]: e.target.value })

  return (
    <div className="space-y-8">
      <div>
        <SectionHeader title="Profile" description="The bio, headline and contact details shown across the site." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={profile.name} onChange={set('name')} />
          <Field label="Preferred name" value={profile.preferredName} onChange={set('preferredName')} />
          <div className="sm:col-span-2">
            <Field label="Headline" value={profile.headline} onChange={set('headline')} />
          </div>
          <Field label="Tagline" value={profile.tagline} onChange={set('tagline')} />
          <Field label="Location" value={profile.location} onChange={set('location')} />
          <Field label="Email" type="email" value={profile.email} onChange={set('email')} />
          <Field label="Phone (optional)" value={profile.phone} onChange={set('phone')} />
          <Field label="Availability badge text" value={profile.availability} onChange={set('availability')} />
          <Field label="GitHub URL" value={profile.github} onChange={set('github')} />
          <Field label="LinkedIn URL" value={profile.linkedin} onChange={set('linkedin')} />
          <Field label="Resume/CV URL (optional)" value={profile.resumeUrl} onChange={set('resumeUrl')} />
        </div>
        <div className="mt-4">
          <ImageUploadField
            label="Photo"
            value={profile.photo}
            onChange={(url) => onChangeProfile({ ...profile, photo: url })}
            hint="Shown in the framed panel on the homepage."
          />
        </div>
        <div className="mt-4">
          <TextArea
            label="About (paragraphs separated by a blank line)"
            rows={8}
            value={profile.about}
            onChange={set('about')}
          />
        </div>
        <div className="mt-4">
          <Field label="Pivot quote" value={profile.pivotQuote} onChange={set('pivotQuote')} />
        </div>
        <div className="mt-4">
          <ListField label="Top skills" value={profile.topSkills} onChange={(v) => onChangeProfile({ ...profile, topSkills: v })} />
        </div>
      </div>

      <div>
        <SectionHeader title="Site branding" description="Logo images (per theme) and the initials fallback." />
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUploadField
            label="Logo — light theme"
            value={siteConfig.logoImageLight}
            onChange={(url) => onChangeSiteConfig({ ...siteConfig, logoImageLight: url })}
          />
          <ImageUploadField
            label="Logo — dark theme"
            value={siteConfig.logoImageDark}
            onChange={(url) => onChangeSiteConfig({ ...siteConfig, logoImageDark: url })}
          />
        </div>
        <div className="mt-4 max-w-xs">
          <Field label="Initials fallback" value={siteConfig.logoInitials} onChange={setSite('logoInitials')} />
        </div>
        <p className="mt-2 text-xs text-muted">
          Used when no logo image is set for the active theme. To change the browser tab icon itself, replace
          /public/favicon.png directly — that one isn't editable from here.
        </p>
      </div>
    </div>
  )
}
