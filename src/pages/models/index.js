import PageHeader from '@/components/common/PageHeader'
import Protected from '@/layouts/Protected'

export default function Models() {
  return (
    <>
      <PageHeader
        TopBarContent={{
          pageTitle: 'Models',
        }}
      />
    </>
  )
}
Models.getLayout = (page) => <Protected>{page}</Protected>
Models.pageTitle = 'Models'
