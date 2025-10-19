/**
 * Simple command factory for creating seeder commands
 * Uses Command pattern for CLI operations
 */
export class CommandFactory {
  static commands = new Map();

  /**
   * Register a command
   */
  static registerCommand(name, commandClass) {
    this.commands.set(name, commandClass);
  }

  /**
   * Create a command by name
   */
  static createCommand(name, options = {}) {
    const CommandClass = this.commands.get(name);
    
    if (!CommandClass) {
      throw new Error(`Unknown command: ${name}`);
    }

    return new CommandClass(name, options);
  }

  /**
   * Get all available commands
   */
  static getAvailableCommands() {
    return Array.from(this.commands.keys());
  }

  /**
   * Check if command exists
   */
  static hasCommand(name) {
    return this.commands.has(name);
  }
}
