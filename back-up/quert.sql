SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.brand,
    p.model,
    p.price,
    p.description,
    p.specifications,
    p.stock_quantity,
    p.created_at AS product_created_at,
    p.updated_at AS product_updated_at,
    p.status AS product_status,
    i.id AS thumbnail_id,
    i.url AS thumbnail_url,
    i.alt_text AS thumbnail_alt_text,
    STRING_AGG(DISTINCT c.name, ', ') AS categories,
    ARRAY_AGG(DISTINCT pi.image_id) AS product_image_ids
FROM 
    products p
LEFT JOIN 
    images i ON p.thumbnail_id = i.id
LEFT JOIN 
    product_categories pc ON p.id = pc.product_id
LEFT JOIN 
    categories c ON pc.category_id = c.id
LEFT JOIN 
    product_images pi ON p.id = pi.product_id
WHERE 
    p.status = 1
GROUP BY 
    p.id, i.id
ORDER BY 
    p.created_at DESC;


----
SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.brand,
    p.model,
    p.price,
    p.description,
    p.specifications,
    p.stock_quantity,
    p.created_at AS product_created_at,
    p.updated_at AS product_updated_at,
    p.status AS product_status,
    i.id AS thumbnail_id,
    i.url AS thumbnail_url,
    i.alt_text AS thumbnail_alt_text,
    STRING_AGG(DISTINCT c.name, ', ') AS categories,
    ARRAY_AGG(DISTINCT pi.image_id) AS product_image_ids
FROM 
    products p
LEFT JOIN 
    images i ON p.thumbnail_id = i.id
LEFT JOIN 
    product_categories pc ON p.id = pc.product_id
LEFT JOIN 
    categories c ON pc.category_id = c.id
LEFT JOIN 
    product_images pi ON p.id = pi.product_id
WHERE 
    p.status = 1
    AND (
        p.name ILIKE '%' || :keyword || '%'
        OR p.brand ILIKE '%' || :keyword || '%'
        OR p.model ILIKE '%' || :keyword || '%'
        OR p.description ILIKE '%' || :keyword || '%'
        OR c.name ILIKE '%' || :keyword || '%'
    )
GROUP BY 
    p.id, i.id
ORDER BY 
    p.created_at DESC;




-----------


SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.brand,
    p.model,
    p.price,
    p.slug,
    p.description,
    p.specifications,
    p.stock_quantity,
    p.created_at AS product_created_at,
    p.updated_at AS product_updated_at,
    p.status AS product_status,
    i.id AS thumbnail_id,
    i.url AS thumbnail_url,
    i.alt_text AS thumbnail_alt_text,
    STRING_AGG(DISTINCT c.name, ', ') AS categories,
    ARRAY_AGG(DISTINCT pi.image_id) AS product_image_ids,
    ARRAY_AGG(DISTINCT i2.url) AS product_image_urls
FROM
    products p
        LEFT JOIN
    images i ON p.thumbnail_id = i.id
        LEFT JOIN
    product_categories pc ON p.id = pc.product_id
        LEFT JOIN
    categories c ON pc.category_id = c.id
        LEFT JOIN
    product_images pi ON p.id = pi.product_id
        LEFT JOIN
    images i2 ON pi.image_id = i2.id
WHERE
    p.status = 1
GROUP BY
    p.id, i.id;
