<template>
  <div class="hotel-loading">
    <div class="hotel-loading-orb hotel-loading-orb--1" />
    <div class="hotel-loading-orb hotel-loading-orb--2" />
    <div class="hotel-loading-card">
      <div class="hotel-loading-avatar sf-skeleton-pulse" />
      <div class="hotel-loading-lines">
        <div class="sf-skeleton-line sf-skeleton-pulse" style="width: 70%" />
        <div class="sf-skeleton-line sf-skeleton-pulse" style="width: 90%" />
        <div class="sf-skeleton-line sf-skeleton-pulse" style="width: 55%" />
      </div>
    </div>
    <p class="hotel-loading-text">Preparing your hotel experience…</p>
  </div>
</template>

<style scoped>
.hotel-loading {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background: #2c2c2a;
  position: relative;
  overflow: hidden;
}

.hotel-loading-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.35;
  animation: sf-glow-drift 8s ease-in-out infinite;
}

.hotel-loading-orb--1 {
  width: 280px;
  height: 280px;
  background: #1a1a1a;
  top: 10%;
  left: -5%;
}

.hotel-loading-orb--2 {
  width: 220px;
  height: 220px;
  background: #000000;
  bottom: 15%;
  right: -5%;
  animation-delay: -3s;
}

.hotel-loading-card {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(241, 239, 232, 0.06);
  border: 0.5px solid rgba(211, 209, 199, 0.15);
  border-radius: 14px;
  backdrop-filter: blur(8px);
}

.hotel-loading-avatar {
  width: 56px;
  height: 56px;
  border-radius: 10px;
}

.hotel-loading-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sf-skeleton-line {
  height: 10px;
  border-radius: 4px;
}

.sf-skeleton-pulse,
.hotel-loading-avatar {
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.06) 75%);
  background-size: 200% 100%;
  animation: sf-skeleton 1.6s ease-in-out infinite;
}

.hotel-loading-text {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 13px;
  color: #888780;
  letter-spacing: 0.04em;
}
</style>
