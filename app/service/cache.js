'use strict';

const Service = require('egg').Service;

class CacheService extends Service {
/**
 * 设置缓存
 * @param {string} key - 缓存键
 * @param {string|Object} value - 缓存值
 * @param {number} [expire] - 过期时间(秒)，可选（默认两分钟）
 */
async setCache(key, value, expire = 2 * 60) {
    const { ctx, app } = this;
    try {
      // 如果为对象，则进行序列化
      const cacheValue = typeof value === 'object' ? JSON.stringify(value) : value;
      await app.redis.set(key, cacheValue, 'EX', expire);
      ctx.logger.info(`缓存设置成功，key: ${key}`);
    } catch (err) {
      app.logger.error(`缓存设置失败，key: ${key}`, err);
      throw err;
    }
  }

  /**
 * 获取缓存
 * @param {string} key - 缓存键
 * @return Object
 */
async getCache(key) {
    const { app } = this;
    try {
      const value = await app.redis.get(key);
      if (value === null) {
        app.logger.info(`缓存不存在，key: ${key}`);
        return null;
      }
      app.logger.info(`获取缓存成功，key: ${key}`);
      return JSON.parse(value);
    } catch (err) {
      app.logger.error(`获取缓存失败，key: ${key}`, err);
      throw err;
    }
  }
}

module.exports = CacheService;