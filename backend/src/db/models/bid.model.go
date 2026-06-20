package db_models

import "time"

type Bid struct {
	ID        uint      `gorm:"primaryKey;column:bid_id"`
	AuctionID uint      `gorm:"column:bid_auction_id"`
	Auction   Auction   `gorm:"foreignKey:AuctionID"`
	BidderID  uint      `gorm:"column:bid_bidder_id"`
	Bidder    User      `gorm:"foreignKey:BidderID"`
	Amount    uint      `gorm:"column:bid_amount"`
	PlacedAt  time.Time `gorm:"column:bid_placed_at"`
}
