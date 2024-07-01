import PageHeader from '@/components/common/PageHeader'
import Protected from '@/layouts/Protected'

export default function Products() {
  return (
    <>
      <PageHeader
        TopBarContent={{
          pageTitle: 'Products',
        }}
      />
    </>
  )
}
Products.getLayout = (page) => <Protected>{page}</Protected>
Products.pageTitle = 'Products'
