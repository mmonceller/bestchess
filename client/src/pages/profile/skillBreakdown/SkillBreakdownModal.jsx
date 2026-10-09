import { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import SkillBadge from '../../../components/skill/SkillBadge.jsx';
import { skillApi } from '../../../api/endpoints.js';
import PointsBreakdown from './PointsBreakdown.jsx';
import PatternBreakdown from './PatternBreakdown.jsx';
import './skillBreakdown.css';

const TABS = [
  { id: 'points', label: 'Points Breakdown', short: 'Points', icon: 'trophy' },
  { id: 'patterns', label: 'Skill Mastery', short: 'Mastery', icon: 'target' },
];

/* Opened from the skill badge: how the rating is built and which ideas the player uses or misses. */
export default function SkillBreakdownModal({ skill, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('points');

  useEffect(() => {
    let alive = true;
    skillApi.breakdown()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message || 'Could not load your breakdown.'));
    return () => { alive = false; };
  }, []);

  return (
    <Modal onClose={onClose} className="skill-breakdown-modal">
      <div className="sb-head">
        <div>
          <h2>Your performance</h2>
          <SkillBadge skill={data?.skill || skill} />
        </div>
        <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}><Icon name="close" size={18} /></button>
      </div>

      <div className="segmented sb-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} size={15} /> <span className="sb-tab-long">{t.label}</span><span className="sb-tab-short">{t.short}</span>
          </button>
        ))}
      </div>

      <div className="sb-body">
        {error && <p className="error-text small">{error}</p>}
        {!data && !error && <div className="center muted" style={{ padding: 24 }}><span className="spinner" /></div>}
        {data && tab === 'points' && <PointsBreakdown points={data.points} skill={data.skill} />}
        {data && tab === 'patterns' && <PatternBreakdown patterns={data.patterns} />}
      </div>
    </Modal>
  );
}
