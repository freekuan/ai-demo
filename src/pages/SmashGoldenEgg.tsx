import { GiftOutlined, RedoOutlined } from '@ant-design/icons'
import { Button, Modal, Typography } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import './SmashGoldenEgg.css'

type Prize = {
  id: string
  label: string
  desc: string
  emoji: string
  weight: number
}

const PRIZE_POOL: Prize[] = [
  {
    id: 'c5',
    label: '5 元店铺券',
    desc: '满 50 可用，领取后 7 天有效',
    emoji: '🎫',
    weight: 25,
  },
  {
    id: 'c10',
    label: '10 元店铺券',
    desc: '满 99 可用，领取后 7 天有效',
    emoji: '🎟️',
    weight: 12,
  },
  {
    id: 'points50',
    label: '50 积分',
    desc: '已发放至您的积分账户',
    emoji: '✨',
    weight: 28,
  },
  {
    id: 'thanks',
    label: '谢谢参与',
    desc: '再接再厉，好运在下一只金蛋里',
    emoji: '🙏',
    weight: 28,
  },
  {
    id: 'gift',
    label: '神秘小礼品',
    desc: '请于会员中心填写收货地址',
    emoji: '🎁',
    weight: 7,
  },
]

function rollPrize(): Prize {
  const total = PRIZE_POOL.reduce((s, p) => s + p.weight, 0)
  let r = Math.random() * total
  for (const p of PRIZE_POOL) {
    r -= p.weight
    if (r <= 0) return p
  }
  return PRIZE_POOL[PRIZE_POOL.length - 1]
}

const EGG_COUNT = 3

export default function SmashGoldenEgg() {
  const [remaining, setRemaining] = useState(3)
  const [broken, setBroken] = useState<Record<number, boolean>>({})
  const [slamming, setSlamming] = useState<number | null>(null)
  const [prize, setPrize] = useState<Prize | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const brokenCount = useMemo(
    () => Object.values(broken).filter(Boolean).length,
    [broken],
  )

  const handleEgg = useCallback(
    (index: number) => {
      if (remaining <= 0 || broken[index]) return

      setSlamming(index)
      window.setTimeout(() => {
        const won = rollPrize()
        setRemaining((n) => Math.max(0, n - 1))
        setBroken((b) => ({ ...b, [index]: true }))
        setPrize(won)
        setModalOpen(true)
        setSlamming(null)
      }, 520)
    },
    [remaining, broken],
  )

  const resetDemo = useCallback(() => {
    setRemaining(3)
    setBroken({})
    setPrize(null)
    setModalOpen(false)
    setSlamming(null)
  }, [])

  return (
    <div className="egg-page">
      <div className="egg-hero">
        <div className="egg-hero-badge">限时活动</div>
        <Typography.Title level={2} className="egg-hero-title" style={{ color: '#fff' }}>
          砸金蛋 · 赢好礼
        </Typography.Title>
        <p className="egg-hero-sub">2026.05.18 — 2026.06.18 · 每日福利放送中</p>
        <div className="egg-stats">
          <div className="egg-stat">
            <div className="egg-stat-value">{remaining}</div>
            <div className="egg-stat-label">剩余次数</div>
          </div>
          <div className="egg-stat">
            <div className="egg-stat-value">{brokenCount}/{EGG_COUNT}</div>
            <div className="egg-stat-label">已砸开</div>
          </div>
        </div>
      </div>

      <div className="egg-stage-wrap">
        <div className="egg-stage">
          <p className="egg-stage-hint">
            点击任意一只<strong>金蛋</strong>开始 · 每位用户共有 3 次机会
          </p>

          <div className="egg-row">
            {Array.from({ length: EGG_COUNT }).map((_, i) => (
              <div key={i} className="egg-pedestal">
                <button
                  type="button"
                  className={[
                    'egg-shell',
                    slamming === i ? ' slamming' : '',
                    broken[i] ? ' open' : '',
                  ].join('')}
                  disabled={remaining <= 0 || broken[i] || slamming !== null}
                  onClick={() => handleEgg(i)}
                  aria-label={`金蛋 ${i + 1}`}
                >
                  <div className="egg-body">
                    <div className="egg-shine" />
                  </div>
                  <div className="egg-crack-layer" aria-hidden>
                    <svg viewBox="0 0 100 124" fill="none">
                      <path
                        d="M35 40 L50 58 L40 72 M52 42 L58 65 L48 78"
                        stroke="rgba(183,28,28,0.55)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M58 38 L68 55 L62 74"
                        stroke="rgba(183,28,28,0.4)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="egg-confetti" aria-hidden>
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="egg-open-placeholder" aria-hidden>
                    💥
                  </div>
                </button>
                <span className="egg-label">
                  {broken[i] ? '已开奖' : `金蛋 ${i + 1}`}
                </span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Button icon={<RedoOutlined />} onClick={resetDemo}>
              重置演示
            </Button>
          </div>
        </div>
      </div>

      <div className="egg-rules">
        <h3>活动规则</h3>
        <ol>
          <li>每位用户每日可参与 3 次，次数用完后次日 0 点刷新（本 Demo 用「重置演示」代替）。</li>
          <li>实物奖品请在 7 日内在会员中心填写收货信息，逾期视为放弃。</li>
          <li>优惠券使用门槛与有效期以券面说明为准，不可转赠。</li>
          <li>本活动解释权归店铺运营方所有。</li>
        </ol>
      </div>

      <Modal
        className="prize-modal"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        width={360}
      >
        {prize && (
          <>
            <div className="prize-modal-inner">
              <div className="prize-modal-emoji">{prize.emoji}</div>
              <Typography.Title level={4} className="prize-modal-title">
                恭喜获得 · {prize.label}
              </Typography.Title>
              <p className="prize-modal-desc">{prize.desc}</p>
            </div>
            <div className="prize-modal-footer">
              <Button
                type="primary"
                block
                size="large"
                icon={<GiftOutlined />}
                onClick={() => setModalOpen(false)}
              >
                开心收下
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
