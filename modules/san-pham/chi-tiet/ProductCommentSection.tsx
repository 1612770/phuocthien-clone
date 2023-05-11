import { SendOutlined } from '@ant-design/icons';
import { REVIEWS_LOAD_PER_TIME } from '@configs/constants/review';
import Product from '@configs/models/product.model';
import { Review } from '@configs/models/review.model';
import { ProductClient } from '@libs/client/Product';
import { getAvatarCharacters } from '@libs/helpers';
import TimeUtils from '@libs/utils/time.utils';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';
import { useAppMessage } from '@providers/AppMessageProvider';
import { useAuth } from '@providers/AuthProvider';
import { Button, Input, List, Typography, Avatar } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function ProductCommentSection({
  product,
  defaultReviews,
}: {
  product: Product;
  defaultReviews: Review[];
}) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const appMessage = useAppMessage();
  const confirmDialog = useAppConfirmDialog();
  const auth = useAuth();

  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allowLoadMore, setAllowLoadMore] = useState(true);

  const onSendReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const productClient = new ProductClient(null, {});
      const _description = description.trim();

      if (!product.key || !_description) return;
      setLoading(true);
      await productClient.createReview({
        productKey: product.key,
        description: _description,
      });

      confirmDialog.setConfirmData({
        title: 'Gửi câu hỏi/đánh giá thành công !',
        content:
          'Câu hỏi của bạn đã được gửi đến đội ngũ nhà thuốc. Chúng tôi sẽ phản hồi trong thời gian sớm nhất',
        cancelButtonProps: {
          hidden: true,
        },
      });

      setDescription('');
    } catch (error) {
      appMessage.toastError({ data: error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setReviews(defaultReviews);
    setAllowLoadMore(defaultReviews.length === REVIEWS_LOAD_PER_TIME);
  }, [defaultReviews]);

  const loadMore = async () => {
    if (loadingMore) return;

    try {
      const productClient = new ProductClient(null, {});

      setLoadingMore(true);
      const reviewResponse = await productClient.getReviews({
        page: Math.floor(reviews.length / REVIEWS_LOAD_PER_TIME) + 1,
        pageSize: REVIEWS_LOAD_PER_TIME,
        key: product.key,
      });

      setReviews([...reviews, ...(reviewResponse.data?.data || [])]);
      setAllowLoadMore(
        reviewResponse.data?.data?.length === REVIEWS_LOAD_PER_TIME
      );
    } catch (error) {
      appMessage.toastError({ data: error });
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="container my-4 w-full rounded-lg border border-solid border-white p-0 shadow-none md:max-w-[1200px] md:border-gray-100 md:p-6 md:shadow-lg">
      <Typography.Title level={5} className="font-medium uppercase">
        Hỏi đáp về sản phẩm {product?.detail?.displayName}
      </Typography.Title>

      {auth.isUserLoggedIn && (
        <form onSubmit={onSendReview} className="relative">
          <Input.TextArea
            rows={4}
            value={description}
            placeholder="Nhập câu hỏi hoặc đánh giá của bạn..."
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></Input.TextArea>
          <Button
            icon={<SendOutlined />}
            type="primary"
            loading={loading}
            htmlType="submit"
            className="shadown-none absolute bottom-2 right-2"
          >
            Gửi
          </Button>
        </form>
      )}

      {!auth.isUserLoggedIn && (
        <div className="flex flex-col items-center justify-center">
          <Typography.Text className="text-sm">
            Bạn chưa thực hiện đăng nhập. Vui lòng đăng nhập để đặt câu hỏi hoặc
            đánh giá
          </Typography.Text>
          <Link href="/dang-nhap">
            <Button className="font-medium uppercase text-primary" type="link">
              Đăng nhập
            </Button>
          </Link>{' '}
        </div>
      )}

      <List className="my-2">
        {reviews?.map((review) => {
          return (
            <List.Item className="border-none py-2 px-0" key={review.key}>
              <List.Item.Meta
                avatar={
                  <Avatar src={review.client?.imgUrl} alt="Người dùng">
                    {getAvatarCharacters(review.client?.displayName)}
                  </Avatar>
                }
                title={
                  <div>
                    <div className="">
                      <div className="flex gap-2">
                        <Typography.Text>
                          {review.client?.displayName}
                        </Typography.Text>
                      </div>
                      <div className="my-1 inline-block">
                        <Typography.Text className="font-normal">
                          {review.description}
                        </Typography.Text>
                      </div>
                      <Typography className="text-xs font-normal text-gray-500">
                        {TimeUtils.formatDate(review.createdDate)}
                      </Typography>
                    </div>

                    <List className="my-2">
                      {review.listReplied?.map((reply) => {
                        return (
                          <List.Item
                            className="relative w-full rounded-lg border border-primary-border bg-primary-background p-4"
                            key={review.key}
                          >
                            <div
                              className="absolute top-[-10px] left-[10px] h-0 w-0 border-b-primary-background"
                              style={{
                                borderLeft: '10px solid transparent',
                                borderRight: '10px solid transparent',
                                borderBottom: '10px solid ',
                              }}
                            ></div>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  className="bg-primary"
                                  src={review.client?.imgUrl}
                                  alt="Mod"
                                >
                                  {getAvatarCharacters(
                                    review.client?.displayName
                                  )}
                                </Avatar>
                              }
                              title={
                                <div className="" key={reply.key}>
                                  <div className="flex gap-2">
                                    <Typography.Text>
                                      {review.client?.displayName}{' '}
                                      <Typography.Text className="font-normal text-primary">
                                        (Quản trị viên)
                                      </Typography.Text>
                                    </Typography.Text>
                                  </div>
                                  <div className="my-1 inline-block">
                                    <Typography.Text className="font-normal">
                                      {review.description}
                                    </Typography.Text>
                                  </div>
                                  <Typography className="text-xs font-normal text-gray-500">
                                    {TimeUtils.formatDate(review.createdDate)}
                                  </Typography>
                                </div>
                              }
                            />
                          </List.Item>
                        );
                      })}
                    </List>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>

      <div className="mt-2 flex justify-center">
        {allowLoadMore && (
          <Button
            type="primary"
            className={'hidden lg:inline-block '}
            ghost
            onClick={loadMore}
            loading={loadingMore}
          >
            Xem thêm câu hỏi/đánh giá khác
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProductCommentSection;
