import Manager from '../../components/admin/Manager'
import Gallery from '../../components/admin/Gallery'
import {F} from '../../lib/fields'
const Page=({t,children})=><div><h1 className="font-display mb-6 text-2xl font-semibold">{t}</h1><div className="space-y-10">{children}</div></div>
const S=({t,table,fields})=><Page t={t}><Manager singleton sortable={false} table={table} fields={fields}/></Page>
export const Profile=()=><S t="Profile & Hero" table="profiles" fields={F.profile}/>
export const About=()=><S t="About" table="profiles" fields={F.about}/>
export const Contact=()=><S t="Contact" table="profiles" fields={F.contact}/>
export const Settings=()=><S t="Site Settings" table="site_settings" fields={F.settings}/>
export const Experience=()=><Page t="Experience"><Manager table="experiences" title="Pengalaman" fields={F.experience} publishable primary="role" sub="company"/></Page>
export const Projects=()=><Page t="Projects"><Manager table="projects" title="Proyek" fields={F.project} publishable thumb="thumbnail_url" sub="category" extra={r=><Gallery projectId={r.id}/>}/></Page>
export const Education=()=><Page t="Education"><Manager table="education" title="Pendidikan" fields={F.education} publishable primary="institution" sub="degree" thumb="logo_url"/></Page>
export const Social=()=><Page t="Social Links"><Manager table="social_links" title="Link sosial" fields={F.social} publishable primary="platform" sub="url"/></Page>
export const Skills=()=><Page t="Skills"><Manager table="skill_categories" title="Kategori skill" fields={F.category} primary="name"/><Manager table="skills" title="Skill" fields={F.skill} primary="name"/></Page>
