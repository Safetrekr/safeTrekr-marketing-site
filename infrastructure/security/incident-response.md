# Incident Response Plan -- SafeTrekr Marketing Site

**Document ID**: ST-869 (REQ-116)
**Version**: 1.0
**Last Updated**: 2026-03-24
**Classification**: Internal -- Engineering and Security Teams
**Owner**: Security Engineering
**Review Cadence**: Quarterly

---

## 1. Severity Levels

| Level | Name | Response Time | Description |
|-------|------|---------------|-------------|
| **P1** | Critical | 1 hour | Complete site unavailability, active data breach, defacement, or any incident affecting user data integrity. |
| **P2** | High | 4 hours | Partial service degradation, form pipeline failure, suspected unauthorized access, or dependency vulnerability with known exploits. |
| **P3** | Medium | 24 hours | Minor service issues, non-critical dependency vulnerability, performance degradation, or failed monitoring alerts. |

---

## 2. Contact List

| Role | Contact | Escalation |
|------|---------|------------|
| Security Lead | security@safetrekr.com | P1/P2: immediate |
| On-Call Engineer | on-call rotation (PagerDuty) | P1: immediate, P2: 4hr |
| Engineering Manager | engineering@safetrekr.com | P1: 15 min, P2: 4hr |
| VP Engineering | escalation via PagerDuty | P1 only (if unresolved in 2hr) |
| Legal/Compliance | legal@safetrekr.com | Data breach scenarios only |
| Communications | comms@safetrekr.com | Public-facing incidents only |

**On-Call Rotation**: Weekly rotation among senior engineers. Schedule maintained in PagerDuty. Handoff occurs every Monday at 09:00 ET.

---

## 3. Incident Scenarios

### 3.1 Site Defacement

**Description**: Unauthorized modification of site content, visual elements, or injected content visible to end users.

**Detection Method**:
- Visual regression tests (ST-864) detect unexpected pixel changes in CI
- Uptime monitoring alerts on content hash mismatch
- User reports via support channels
- Cloudflare WAF alerts for injection attempts

**Immediate Response** (P1 -- 1 hour):
1. Confirm defacement is real (not a deployment issue or CDN cache artifact)
2. Take screenshots of the defaced content for forensic evidence
3. Roll back to the last known-good deployment via DigitalOcean DOKS:
   ```bash
   kubectl rollout undo deployment/safetrekr-web -n production
   ```
4. Block the attack vector if identified (IP block via Cloudflare, disable compromised credentials)
5. Rotate all deployment credentials (Docker registry, Kubernetes service accounts)

**Notification**:
- P1 PagerDuty alert to on-call engineer and security lead
- Notify engineering manager within 15 minutes
- If user data potentially affected: notify legal@safetrekr.com

**Recovery**:
1. Conduct full audit of deployment pipeline for unauthorized changes
2. Review Git history for unauthorized commits
3. Verify container image integrity against known SHA digests
4. Redeploy from verified source after root cause is identified
5. Enable enhanced monitoring for 72 hours post-recovery

**Post-Mortem**:
- Blameless post-mortem within 48 hours
- Document root cause, timeline, and corrective actions
- Update WAF rules and monitoring as needed
- Review access controls for deployment pipeline

---

### 3.2 DDoS Attack

**Description**: Distributed denial-of-service attack rendering the marketing site unavailable or severely degraded.

**Detection Method**:
- DigitalOcean monitoring alerts on abnormal traffic patterns
- Cloudflare DDoS detection and automatic mitigation
- Uptime monitoring (Pingdom/UptimeRobot) alerts on 5xx responses
- Kubernetes HPA scaling beyond normal thresholds

**Immediate Response** (P1 -- 1 hour):
1. Verify the traffic spike is malicious (not organic viral traffic)
2. Enable Cloudflare "Under Attack" mode:
   - Dashboard > Security > Settings > Security Level > I'm Under Attack
3. Review Cloudflare analytics to identify attack patterns (source IPs, request patterns)
4. If attack bypasses Cloudflare:
   - Scale up Kubernetes replicas: `kubectl scale deployment/safetrekr-web --replicas=10 -n production`
   - Enable rate limiting at the ingress level
5. Block identified malicious IP ranges via Cloudflare firewall rules

**Notification**:
- P1 PagerDuty alert to on-call engineer
- Notify engineering manager if site is down > 15 minutes
- Status page update if downtime exceeds 30 minutes

**Recovery**:
1. Monitor traffic patterns for 24 hours after attack subsides
2. Gradually disable "Under Attack" mode once traffic normalizes
3. Scale replicas back to normal levels
4. Review and update Cloudflare rate limiting rules
5. Analyze attack traffic for patterns to add to permanent block rules

**Post-Mortem**:
- Document attack vector, duration, and impact
- Review and update DDoS mitigation playbook
- Evaluate need for additional Cloudflare plan features
- Update infrastructure capacity planning

---

### 3.3 Form Pipeline Failure

**Description**: Contact form, demo request form, or newsletter signup fails to process submissions. Leads are lost or delayed.

**Detection Method**:
- Supabase monitoring alerts on write failures
- SendGrid delivery monitoring alerts on email failures
- Application error logging (form submission 500 errors)
- Manual QA: zero new leads in dashboard for > 4 hours during business hours

**Immediate Response** (P2 -- 4 hours):
1. Check Supabase service status (status.supabase.com)
2. Check SendGrid service status (status.sendgrid.com)
3. Review application logs for form submission errors:
   ```bash
   kubectl logs -l app=safetrekr-web -n production --tail=200 | grep "submit-form"
   ```
4. Test form submission manually on the live site
5. If Supabase is down: enable fallback logging to application logs (submissions can be recovered)
6. If SendGrid is down: submissions still persist in Supabase; email notifications will be retried

**Notification**:
- Alert engineering team via Slack (#safetrekr-incidents)
- Notify sales team if lead capture is affected > 2 hours
- P2 PagerDuty alert if automated detection triggers

**Recovery**:
1. If third-party service was down: verify recovery and test end-to-end
2. Replay any failed submissions from application logs or error queue
3. Verify all Supabase rows have corresponding SendGrid delivery
4. Send manual notification emails for any submissions missed during outage
5. Validate Turnstile (CAPTCHA) service is operational

**Post-Mortem**:
- Document which service failed and for how long
- Evaluate need for submission queue/retry mechanism
- Review monitoring coverage for form pipeline components
- Update runbook with specific service-failure scenarios

---

### 3.4 Data Breach

**Description**: Unauthorized access to form submission data (names, emails, organizations) stored in Supabase or transmitted via SendGrid.

**Detection Method**:
- Supabase audit logs show unauthorized queries or data exports
- Unusual API key usage patterns in Supabase dashboard
- SendGrid alerts on unauthorized API access
- Security scanning tools detect exposed credentials
- User reports of spam/phishing using data submitted via SafeTrekr forms

**Immediate Response** (P1 -- 1 hour):
1. Confirm the breach scope: what data was accessed, by whom, and when
2. Immediately rotate all compromised credentials:
   - Supabase API keys (anon + service role)
   - SendGrid API key
   - Turnstile secret key
   - Any environment variables in the deployment
3. Revoke all active Supabase sessions
4. Enable Supabase Row Level Security (RLS) emergency lockdown if not already active
5. Preserve all logs and audit trails for forensic analysis -- do NOT delete

**Notification**:
- Immediate P1 PagerDuty to security lead and engineering manager
- Notify legal@safetrekr.com within 1 hour
- Notify VP Engineering within 2 hours
- If personal data affected: prepare breach notification per applicable regulations (GDPR: 72hr, state laws vary)

**Recovery**:
1. Complete forensic analysis of breach vector
2. Patch the vulnerability that allowed unauthorized access
3. Deploy with rotated credentials
4. Audit all Supabase RLS policies
5. Conduct security review of all API endpoints
6. Engage external security consultant if breach is significant

**Post-Mortem**:
- Mandatory blameless post-mortem within 24 hours
- Document complete timeline, impact assessment, and remediation
- File regulatory notifications if required
- Review and strengthen access controls, key rotation policies
- Schedule penetration test within 30 days

---

### 3.5 Dependency Vulnerability

**Description**: A critical or high-severity vulnerability is discovered in a project dependency (npm package, Docker base image, or system library).

**Detection Method**:
- GitHub Dependabot alerts
- `npm audit` in CI pipeline
- Snyk/Socket.dev monitoring (if configured)
- CVE database notifications for monitored packages
- SBOM (ST-832) cross-referenced against vulnerability databases

**Immediate Response** (severity-dependent):
- **Critical CVE with known exploit (P2 -- 4 hours)**:
  1. Assess whether the vulnerability is exploitable in our specific usage
  2. If exploitable: begin patching immediately
  3. If not exploitable: document mitigation and schedule patch within 48 hours
- **High CVE without known exploit (P3 -- 24 hours)**:
  1. Review CVE details and assess risk
  2. Schedule patch in next deployment cycle

**Patching Procedure**:
1. Create a dedicated branch: `fix/cve-YYYY-NNNNN`
2. Update the vulnerable dependency:
   ```bash
   npm update <package-name>
   # or for major version changes:
   npm install <package-name>@latest
   ```
3. Run full test suite: `npm run test:unit && npm run lint && npm run type-check && npm run build`
4. If dependency update introduces breaking changes: evaluate and fix
5. Deploy to staging for validation
6. Deploy to production

**Notification**:
- P2: Alert engineering team via Slack
- P3: Add to next sprint planning

**Recovery**:
1. Verify the patched version resolves the CVE
2. Run `npm audit` to confirm no remaining vulnerabilities
3. Update SBOM with new dependency versions
4. Monitor for any regression in production

**Post-Mortem**:
- Document the CVE, affected versions, and remediation timeline
- Review dependency pinning and update policies
- Evaluate whether additional monitoring tools are needed
- Update the SBOM generation schedule if gaps were found

---

## 4. General Incident Procedures

### 4.1 Incident Commander Role

For P1 incidents, the first senior engineer on the scene assumes the Incident Commander (IC) role until explicitly handed off. The IC is responsible for:
- Coordinating response efforts
- Managing communication to stakeholders
- Making rollback/recovery decisions
- Initiating the post-mortem process

### 4.2 Communication Templates

**Internal Slack (P1)**:
```
INCIDENT: [Brief description]
SEVERITY: P1
STATUS: Investigating / Mitigating / Resolved
IMPACT: [What users see]
IC: [Name]
NEXT UPDATE: [Time]
```

**Status Page (if downtime > 30 min)**:
```
We are currently experiencing [issue description]. Our team is actively
working to resolve this. We will provide updates every 30 minutes.
```

### 4.3 Post-Mortem Template

Every P1 and P2 incident requires a written post-mortem within 48 hours:

1. **Summary**: One-paragraph description of what happened
2. **Timeline**: Minute-by-minute log of events
3. **Root Cause**: Technical explanation of the failure
4. **Impact**: Users affected, duration, data impact
5. **Resolution**: What was done to fix it
6. **Action Items**: Specific, assigned tasks to prevent recurrence
7. **Lessons Learned**: What went well, what could improve

### 4.4 Drill Schedule

- **Quarterly**: Tabletop exercise walking through one scenario from Section 3
- **Bi-annually**: Live drill simulating a P2 incident with full response activation
- **Annually**: Full P1 drill including stakeholder notification and rollback

---

## 5. Document History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-03-24 | 1.0 | Security Engineering | Initial incident response plan |
