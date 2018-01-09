import { times } from 'lodash/util'

import getFullSourceSpace from '../../lib/get/get-full-source-space'

const maxAllowedLimit = 100
const resultItemCount = 420

function pagedResult (query, maxItems, mock = {}) {
  const {skip, limit} = query
  const cnt = maxItems - skip > limit ? limit : maxItems - skip
  return {
    items: times(cnt, (n) => {
      const id = n * skip + 1
      return Object.assign({
        sys: { id }
      }, mock)
    }),
    total: maxItems
  }
}

function pagedContentResult (query, maxItems, mock = {}) {
  const result = pagedResult(query, maxItems, mock)
  result.items.map((item, index) => {
    item.sys.publishedVersion = index % 2
    return item
  })
  return result
}

const mockSpace = {}

const mockClient = {}

const getEditorInterface = jest.fn()

function setupMocks () {
  mockClient.getSpace = jest.fn(() => Promise.resolve(mockSpace))
  mockSpace.getContentTypes = jest.fn((query) => {
    return Promise.resolve(pagedResult(query, resultItemCount, {
      getEditorInterface
    }))
  })
  mockSpace.getEntries = jest.fn((query) => {
    return Promise.resolve(pagedContentResult(query, resultItemCount))
  })
  mockSpace.getAssets = jest.fn((query) => {
    return Promise.resolve(pagedResult(query, resultItemCount))
  })
  mockSpace.getLocales = jest.fn((query) => {
    return Promise.resolve(pagedResult(query, resultItemCount))
  })
  mockSpace.getWebhooks = jest.fn((query) => {
    return Promise.resolve(pagedResult(query, resultItemCount))
  })
  mockSpace.getRoles = jest.fn((query) => {
    return Promise.resolve(pagedResult(query, resultItemCount))
  })
  getEditorInterface.mockImplementation(() => Promise.resolve({}))
}

beforeEach(setupMocks)

afterEach(() => {
  mockClient.getSpace.mockClear()
  mockSpace.getContentTypes.mockClear()
  mockSpace.getEntries.mockClear()
  mockSpace.getAssets.mockClear()
  mockSpace.getLocales.mockClear()
  mockSpace.getWebhooks.mockClear()
  mockSpace.getRoles.mockClear()
  getEditorInterface.mockClear()
})

test('Gets whole destination content', () => {
  return getFullSourceSpace({
    managementClient: mockClient,
    spaceId: 'spaceid',
    maxAllowedLimit
  })
    .run({
      data: {}
    })
    .then((response) => {
      expect(mockClient.getSpace.mock.calls).toHaveLength(1)
      expect(mockSpace.getContentTypes.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getEntries.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getAssets.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getLocales.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getWebhooks.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getRoles.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(getEditorInterface.mock.calls).toHaveLength(resultItemCount)
      expect(response.data.contentTypes).toHaveLength(resultItemCount)
      expect(response.data.entries).toHaveLength(resultItemCount / 2)
      expect(response.data.assets).toHaveLength(resultItemCount)
      expect(response.data.locales).toHaveLength(resultItemCount)
      expect(response.data.webhooks).toHaveLength(resultItemCount)
      expect(response.data.roles).toHaveLength(resultItemCount)
      expect(response.data.editorInterfaces).toHaveLength(resultItemCount)
    })
})

test('Gets whole destination content without content model', () => {
  return getFullSourceSpace({
    managementClient: mockClient,
    spaceId: 'spaceid',
    maxAllowedLimit,
    skipContentModel: true
  })
    .run({
      data: {}
    })
    .then((response) => {
      expect(mockClient.getSpace.mock.calls).toHaveLength(1)
      expect(mockSpace.getContentTypes.mock.calls).toHaveLength(0)
      expect(mockSpace.getEntries.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getAssets.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getLocales.mock.calls).toHaveLength(0)
      expect(mockSpace.getWebhooks.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getRoles.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(getEditorInterface.mock.calls).toHaveLength(0)
      expect(response.data.contentTypes).toBeUndefined()
      expect(response.data.entries).toHaveLength(resultItemCount / 2)
      expect(response.data.assets).toHaveLength(resultItemCount)
      expect(response.data.locales).toBeUndefined()
      expect(response.data.webhooks).toHaveLength(resultItemCount)
      expect(response.data.roles).toHaveLength(resultItemCount)
      expect(response.data.editorInterfaces).toBeUndefined()
    })
})

test('Gets whole destination content without content', () => {
  return getFullSourceSpace({
    managementClient: mockClient,
    spaceId: 'spaceid',
    maxAllowedLimit,
    skipContent: true
  })
    .run({
      data: {}
    })
    .then((response) => {
      expect(mockClient.getSpace.mock.calls).toHaveLength(1)
      expect(mockSpace.getContentTypes.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getEntries.mock.calls).toHaveLength(0)
      expect(mockSpace.getAssets.mock.calls).toHaveLength(0)
      expect(mockSpace.getLocales.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getWebhooks.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getRoles.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(getEditorInterface.mock.calls).toHaveLength(resultItemCount)
      expect(response.data.contentTypes).toHaveLength(resultItemCount)
      expect(response.data.entries).toBeUndefined()
      expect(response.data.assets).toBeUndefined()
      expect(response.data.locales).toHaveLength(resultItemCount)
      expect(response.data.webhooks).toHaveLength(resultItemCount)
      expect(response.data.roles).toHaveLength(resultItemCount)
      expect(response.data.editorInterfaces).toHaveLength(resultItemCount)
    })
})

test('Gets whole destination content without webhooks', () => {
  return getFullSourceSpace({
    managementClient: mockClient,
    spaceId: 'spaceid',
    maxAllowedLimit,
    skipWebhooks: true
  })
    .run({
      data: {}
    })
    .then((response) => {
      expect(mockClient.getSpace.mock.calls).toHaveLength(1)
      expect(mockSpace.getContentTypes.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getEntries.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getAssets.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getLocales.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getWebhooks.mock.calls).toHaveLength(0)
      expect(mockSpace.getRoles.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(getEditorInterface.mock.calls).toHaveLength(resultItemCount)
      expect(response.data.contentTypes).toHaveLength(resultItemCount)
      expect(response.data.entries).toHaveLength(resultItemCount / 2)
      expect(response.data.assets).toHaveLength(resultItemCount)
      expect(response.data.locales).toHaveLength(resultItemCount)
      expect(response.data.webhooks).toBeUndefined()
      expect(response.data.roles).toHaveLength(resultItemCount)
      expect(response.data.editorInterfaces).toHaveLength(resultItemCount)
    })
})

test('Gets whole destination content without roles', () => {
  return getFullSourceSpace({
    managementClient: mockClient,
    spaceId: 'spaceid',
    maxAllowedLimit,
    skipRoles: true
  })
    .run({
      data: {}
    })
    .then((response) => {
      expect(mockClient.getSpace.mock.calls).toHaveLength(1)
      expect(mockSpace.getContentTypes.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getEntries.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getAssets.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getLocales.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getWebhooks.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getRoles.mock.calls).toHaveLength(0)
      expect(getEditorInterface.mock.calls).toHaveLength(resultItemCount)
      expect(response.data.contentTypes).toHaveLength(resultItemCount)
      expect(response.data.entries).toHaveLength(resultItemCount / 2)
      expect(response.data.assets).toHaveLength(resultItemCount)
      expect(response.data.locales).toHaveLength(resultItemCount)
      expect(response.data.webhooks).toHaveLength(resultItemCount)
      expect(response.data.roles).toBeUndefined()
      expect(response.data.editorInterfaces).toHaveLength(resultItemCount)
    })
})

test('Gets whole destination content with drafts', () => {
  return getFullSourceSpace({
    managementClient: mockClient,
    spaceId: 'spaceid',
    maxAllowedLimit,
    includeDrafts: true
  })
    .run({
      data: {}
    })
    .then((response) => {
      expect(mockClient.getSpace.mock.calls).toHaveLength(1)
      expect(mockSpace.getContentTypes.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getEntries.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getAssets.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getLocales.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getWebhooks.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(mockSpace.getRoles.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(getEditorInterface.mock.calls).toHaveLength(resultItemCount)
      expect(response.data.contentTypes).toHaveLength(resultItemCount)
      expect(response.data.entries).toHaveLength(resultItemCount)
      expect(response.data.assets).toHaveLength(resultItemCount)
      expect(response.data.locales).toHaveLength(resultItemCount)
      expect(response.data.webhooks).toHaveLength(resultItemCount)
      expect(response.data.roles).toHaveLength(resultItemCount)
      expect(response.data.editorInterfaces).toHaveLength(resultItemCount)
    })
})

test('Gets whole destination content and detects missing editor interfaces', () => {
  getEditorInterface.mockImplementation(() => Promise.reject(new Error('No editor interface found')))

  return getFullSourceSpace({
    managementClient: mockClient,
    spaceId: 'spaceid',
    maxAllowedLimit,
    skipContent: true,
    skipWebhooks: true,
    skipRoles: true
  })
    .run({
      data: {}
    })
    .then((response) => {
      expect(mockClient.getSpace.mock.calls).toHaveLength(1)
      expect(mockSpace.getContentTypes.mock.calls).toHaveLength(Math.ceil(resultItemCount / maxAllowedLimit))
      expect(getEditorInterface.mock.calls).toHaveLength(resultItemCount)
      expect(response.data.contentTypes).toHaveLength(resultItemCount)
      expect(response.data.editorInterfaces).toHaveLength(0)
    })
})

test('Skips editor interfaces since no content types are found', () => {
  mockSpace.getContentTypes.mockImplementation(() => Promise.resolve({
    items: [],
    total: 0
  }))

  return getFullSourceSpace({
    managementClient: mockClient,
    spaceId: 'spaceid',
    maxAllowedLimit,
    skipContent: true,
    skipWebhooks: true,
    skipRoles: true
  })
    .run({
      data: {}
    })
    .then((response) => {
      expect(mockClient.getSpace.mock.calls).toHaveLength(1)
      expect(mockSpace.getContentTypes.mock.calls).toHaveLength(1)
      expect(getEditorInterface.mock.calls).toHaveLength(0)
      expect(response.data.contentTypes).toHaveLength(0)
      expect(response.data.editorInterfaces).toBeUndefined()
    })
})

test('Loads 1000 items per page by default', () => {
  return getFullSourceSpace({
    managementClient: mockClient,
    spaceId: 'spaceid',
    skipContent: true,
    skipWebhooks: true,
    skipRoles: true
  })
    .run({
      data: {}
    })
    .then((response) => {
      expect(mockClient.getSpace.mock.calls).toHaveLength(1)
      expect(mockSpace.getContentTypes.mock.calls).toHaveLength(1)
      expect(mockSpace.getContentTypes.mock.calls[0][0].limit).toBe(1000)
      expect(getEditorInterface.mock.calls).toHaveLength(resultItemCount)
      expect(response.data.contentTypes).toHaveLength(resultItemCount)
      expect(response.data.editorInterfaces).toHaveLength(resultItemCount)
    })
})
