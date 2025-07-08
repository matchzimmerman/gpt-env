// simple pause on hover for marquee
const marquee = document.querySelector('.marquee-content');
if (marquee) {
    marquee.addEventListener('mouseover', () => marquee.style.animationPlayState = 'paused');
    marquee.addEventListener('mouseout', () => marquee.style.animationPlayState = 'running');
}
