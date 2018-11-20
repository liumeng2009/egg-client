export const AlgoliaConfig = {
  searchableAttributes: [
    'title', 'content', 'zhaiyao'
  ],
  // Define business metrics for ranking and sorting
  customRanking: [
    'desc(publishAt)'
  ],
  attributesForFaceting: ['title']
}

export const AlgoliaQueryConfig = [
  {
    objectID: 'title',
    condition: {
      pattern: '{facet:title}',
      anchoring: 'contains'
    },
    consequence: {
      params: {
        aroundLatLngViaIP: false
      }
    }
  },
  {
    objectID: 'content',
    condition: {
      pattern: '{facet:content}',
      anchoring: 'contains'
    },
    consequence: {
      params: {
        aroundLatLngViaIP: false
      }
    },
  },
]
