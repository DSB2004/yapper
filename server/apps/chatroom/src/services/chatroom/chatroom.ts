import { Provider } from '@nestjs/common';
import { LRUCache } from 'lru-cache';

export const CHATROOM_CACHE = 'CHATROOM_CACHE';

export const CHATROOMCacheProvider: Provider = {
  provide: CHATROOM_CACHE,
  useFactory: () => {
    return new LRUCache<string, any>({
      max: 5000, // max entries
      ttl: 1000 * 60 * 5, // 5 minutes
    });
  },
};
