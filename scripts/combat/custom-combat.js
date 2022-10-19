
export default class CustomCombat extends Combat {
  async nextRound() {
    this.resetAll();

    await super.nextRound();
  }
}
