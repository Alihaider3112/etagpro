import PageHeader from '@/components/common/PageHeader'
import Protected from '@/layouts/Protected'

export default function Companies() {
  return (
    <>
      <PageHeader
        TopBarContent={{
          pageTitle: 'Companies',
        }}
      />
    </>
  )
}
Companies.getLayout = (page) => <Protected>{page}</Protected>
Companies.pageTitle = 'Companies'
